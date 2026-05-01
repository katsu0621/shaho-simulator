import { GRADE_TABLE, PENSION_MAX_MONTHLY, type Grade } from "../data/gradeTable";
import { COMMON_RATES, PREFECTURES, type PrefectureRate } from "../data/prefectures";

export type OvertimeMode = "支払月の単価" | "働いた月の単価";

export interface OvertimeDetail {
  overtimeHours: number;    // 通常残業時間（時間）
  holidayHours: number;     // 休日出勤時間（時間）
  lateNightHours: number;   // 深夜残業時間（時間）
  over60Hours: number;      // 60H超残業時間（時間）
  over60HolidayHours: number; // 60H超休日時間（時間）
}

export interface MonthInput extends OvertimeDetail {
  baseSalary: number;       // 基本給（円）
  commute: number;          // 通勤手当（円・課税非課税問わず社保算定対象）
  otherAllowance: number;   // その他手当（円）
}

// 3月分の残業詳細（働いた月の単価モード用）
export type MarchOvertime = OvertimeDetail;

// 各種割増率（固定）
export const HOLIDAY_MULTIPLIER = 1.35;
export const LATE_NIGHT_MULTIPLIER = 1.5;
export const OVER60_MULTIPLIER = 1.5;           // 月60H超の時間外労働（50%割増）
export const OVER60_HOLIDAY_MULTIPLIER = 1.6;    // 月60H超の休日労働（35%+25%割増）

export interface SimulationInput {
  prefectureName: string;
  hasCareInsurance: boolean;       // 介護保険2号被保険者該当（40-64歳）か
  scheduledHours: number;          // 月の所定労働時間（残業単価計算の分母）
  overtimeMultiplier: number;      // 残業割増率（例: 1.25）
  overtimeMode: OvertimeMode;
  marchBase: number;               // 3月の基本給（働いた月の単価モード用）
  marchOvertime: MarchOvertime;    // 3月の残業詳細（働いた月の単価モード用）
  april: MonthInput;
  may: MonthInput;
  june: MonthInput;
}

export interface SimulationResult {
  monthlyTotals: { april: number; may: number; june: number };
  overtimePay: { april: number; may: number; june: number };
  threeMonthAverage: number;
  grade: Grade | null;
  standardMonthly: number;
  pensionStandardMonthly: number;     // 厚生年金用（650,000円キャップ）
  healthRate: number;                 // 適用される健保料率（介護要否で切替済）
  pensionRate: number;                // 厚生年金料率
  healthInsuranceMonthly: number;     // 健保料・被保険者負担（円/月）
  pensionInsuranceMonthly: number;    // 厚生年金保険料・被保険者負担（円/月）
  childCareSupportMonthly: number;    // 子ども・子育て支援金・被保険者負担（円/月）
  totalSocialInsuranceMonthly: number;
  annualSocialInsurance: number;
  employerSide: {
    health: number;
    pension: number;
    childCare: number;
    childCareSupport: number;
  };
}

/**
 * 残業代を計算する
 * - 支払月の単価モード: 当月の基本給を単価計算に使う
 * - 働いた月の単価モード: 前月の基本給を単価計算に使う（4月の残業代→3月の基本給）
 * 端数は floor（切り捨て）。
 */
export function calcOvertimePay(
  baseForRate: number,
  scheduledHours: number,
  overtimeHours: number,
  multiplier: number
): number {
  if (scheduledHours <= 0) return 0;
  const hourlyRate = baseForRate / scheduledHours;
  return Math.floor(hourlyRate * multiplier * overtimeHours);
}

/**
 * 月額合計（基本給 + 残業代 + 通勤手当 + その他手当）
 */
export function calcMonthTotal(month: MonthInput, overtimePay: number): number {
  return month.baseSalary + overtimePay + month.commute + month.otherAllowance;
}

/**
 * 報酬月額から健保等級を判定
 * 50等級表の lowerInclusive ≤ 報酬月額 < upperExclusive を満たす等級を返す
 */
export function findGrade(reportedMonthly: number): Grade | null {
  for (const g of GRADE_TABLE) {
    const lowerOk = g.lowerInclusive === null || reportedMonthly >= g.lowerInclusive;
    const upperOk = g.upperExclusive === null || reportedMonthly < g.upperExclusive;
    if (lowerOk && upperOk) return g;
  }
  return null;
}

/**
 * 都道府県名から料率行を取得
 */
export function getPrefecture(name: string): PrefectureRate | undefined {
  return PREFECTURES.find((p) => p.name === name);
}

/**
 * メインのシミュレーション関数
 */
export function simulate(input: SimulationInput): SimulationResult {
  const {
    prefectureName,
    hasCareInsurance,
    scheduledHours,
    overtimeMultiplier,
    overtimeMode,
    marchBase,
    marchOvertime,
    april,
    may,
    june,
  } = input;

  // 残業代計算（モード別に単価の元となる基本給と残業時間を切替）
  // 働いた月の単価モード: 基本給・残業時間ともに前月のものを使う
  const isWorkedMonth = overtimeMode === "働いた月の単価";

  // 各月の計算元（基本給・残業時間3種類）を決定
  const aprilBase = isWorkedMonth ? marchBase        : april.baseSalary;
  const mayBase   = isWorkedMonth ? april.baseSalary : may.baseSalary;
  const juneBase  = isWorkedMonth ? may.baseSalary   : june.baseSalary;

  const aprilSrc = isWorkedMonth ? marchOvertime : april;
  const maySrc   = isWorkedMonth ? april         : may;
  const juneSrc  = isWorkedMonth ? may           : june;

  // 各月の残業代 = 通常残業 + 休日出勤 + 深夜残業 + 60H超 + 60H超休日
  const calcMonthOT = (base: number, src: OvertimeDetail) => {
    return calcOvertimePay(base, scheduledHours, src.overtimeHours, overtimeMultiplier)
      + calcOvertimePay(base, scheduledHours, src.holidayHours, HOLIDAY_MULTIPLIER)
      + calcOvertimePay(base, scheduledHours, src.lateNightHours, LATE_NIGHT_MULTIPLIER)
      + calcOvertimePay(base, scheduledHours, src.over60Hours, OVER60_MULTIPLIER)
      + calcOvertimePay(base, scheduledHours, src.over60HolidayHours, OVER60_HOLIDAY_MULTIPLIER);
  };

  const aprOT = calcMonthOT(aprilBase, aprilSrc);
  const mayOT = calcMonthOT(mayBase, maySrc);
  const junOT = calcMonthOT(juneBase, juneSrc);

  // 月額合計
  const aprTotal = calcMonthTotal(april, aprOT);
  const mayTotal = calcMonthTotal(may, mayOT);
  const junTotal = calcMonthTotal(june, junOT);

  // 3か月平均（小数点以下四捨五入）
  const avg = Math.round((aprTotal + mayTotal + junTotal) / 3);

  // 等級判定
  const grade = findGrade(avg);
  const standardMonthly = grade?.monthly ?? 0;
  const pensionStandardMonthly = Math.min(standardMonthly, PENSION_MAX_MONTHLY);

  // 料率取得
  const pref = getPrefecture(prefectureName);
  const healthRate = hasCareInsurance ? (pref?.rateWithCare ?? 0) : (pref?.rateWithoutCare ?? 0);
  const pensionRate = COMMON_RATES.pensionRate;

  // 保険料計算（被保険者負担=折半。労使折半前の料率を使い、最後に1/2）
  const healthFull  = standardMonthly * healthRate;
  const pensionFull = pensionStandardMonthly * pensionRate;
  const childCareSupportFull = standardMonthly * COMMON_RATES.childCareSupportRate;
  const healthInsuranceMonthly = Math.round(healthFull / 2);
  const pensionInsuranceMonthly = Math.round(pensionFull / 2);
  const childCareSupportMonthly = Math.round(childCareSupportFull / 2);
  const totalSocialInsuranceMonthly = healthInsuranceMonthly + pensionInsuranceMonthly + childCareSupportMonthly;
  const annualSocialInsurance = totalSocialInsuranceMonthly * 12;

  // 事業主負担分（健保・厚年・支援金は労使折半。子ども・子育て拠出金は事業主のみ）
  const employerSide = {
    health: healthInsuranceMonthly,
    pension: pensionInsuranceMonthly,
    childCare: Math.round(pensionStandardMonthly * COMMON_RATES.childCareRate),
    childCareSupport: childCareSupportMonthly,
  };

  return {
    monthlyTotals: { april: aprTotal, may: mayTotal, june: junTotal },
    overtimePay: { april: aprOT, may: mayOT, june: junOT },
    threeMonthAverage: avg,
    grade,
    standardMonthly,
    pensionStandardMonthly,
    healthRate,
    pensionRate,
    healthInsuranceMonthly,
    pensionInsuranceMonthly,
    childCareSupportMonthly,
    totalSocialInsuranceMonthly,
    annualSocialInsurance,
    employerSide,
  };
}
