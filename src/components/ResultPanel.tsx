import type { SimulationResult } from "../lib/calc";

interface ResultPanelProps {
  result: SimulationResult;
  hasCareInsurance: boolean;
}

const fmt = (n: number) => new Intl.NumberFormat("ja-JP").format(n);
const pct = (n: number) => (n * 100).toFixed(2) + "%";

export default function ResultPanel({ result, hasCareInsurance }: ResultPanelProps) {
  const {
    threeMonthAverage,
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
  } = result;

  const showPensionCap = pensionStandardMonthly < standardMonthly;

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold border-b pb-2">計算結果</h2>

      {/* 標準報酬月額の算定 */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-blue-700">標準報酬月額の算定</h3>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-gray-600">3か月平均報酬</dt>
          <dd className="text-right font-medium">{fmt(threeMonthAverage)} 円</dd>

          <dt className="text-gray-600">該当等級</dt>
          <dd className="text-right font-medium">
            {grade
              ? <>健保: 第{grade.grade}等級 / 厚生年金: {grade.pensionGrade ? `第${grade.pensionGrade}等級` : "対象外"}</>
              : "判定不能"
            }
          </dd>

          <dt className="text-gray-600">標準報酬月額</dt>
          <dd className="text-right text-2xl font-bold text-blue-600">{fmt(standardMonthly)} 円</dd>

          <dt className="text-gray-600">報酬月額の範囲</dt>
          <dd className="text-right font-medium">
            {grade
              ? <>
                  {grade.lowerInclusive !== null ? `${fmt(grade.lowerInclusive)} 円以上` : "— "}
                  {" ～ "}
                  {grade.upperExclusive !== null ? `${fmt(grade.upperExclusive)} 円未満` : "上限なし"}
                </>
              : "—"
            }
          </dd>

          {grade && grade.upperExclusive !== null && (
            <>
              <dt className="text-gray-600">次の等級まで</dt>
              <dd className="text-right font-medium text-orange-600">
                あと {fmt(grade.upperExclusive - threeMonthAverage)} 円/月
              </dd>
            </>
          )}

          {showPensionCap && (
            <>
              <dt className="text-gray-600">厚生年金用標準報酬月額</dt>
              <dd className="text-right font-medium">{fmt(pensionStandardMonthly)} 円（上限）</dd>
            </>
          )}
        </dl>
      </div>

      {/* 適用料率 */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-blue-700">適用料率</h3>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-gray-600">健保料率</dt>
          <dd className="text-right font-medium">
            {pct(healthRate)}（{hasCareInsurance ? "介護保険対象" : "介護保険対象外"}）
          </dd>
          <dt className="text-gray-600">厚生年金料率</dt>
          <dd className="text-right font-medium">{pct(pensionRate)}</dd>
          <dt className="text-gray-600">子ども・子育て支援金率</dt>
          <dd className="text-right font-medium">0.23%（労使折半）</dd>
        </dl>
      </div>

      {/* 月額社会保険料 */}
      <div className="bg-blue-50 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-blue-700">月額社会保険料（被保険者負担分）</h3>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-gray-600">健康保険料</dt>
          <dd className="text-right font-medium">{fmt(healthInsuranceMonthly)} 円/月</dd>
          <dt className="text-gray-600">厚生年金保険料</dt>
          <dd className="text-right font-medium">{fmt(pensionInsuranceMonthly)} 円/月</dd>
          <dt className="text-gray-600">子ども・子育て支援金</dt>
          <dd className="text-right font-medium">{fmt(childCareSupportMonthly)} 円/月</dd>
          <dt className="text-gray-600 font-semibold">合計</dt>
          <dd className="text-right text-2xl font-bold text-blue-600">{fmt(totalSocialInsuranceMonthly)} 円/月</dd>
        </dl>
      </div>

      {/* 年間予測 */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-blue-700">年間予測（9月〜翌年8月）</h3>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-gray-600">年間社会保険料</dt>
          <dd className="text-right text-xl font-bold">{fmt(annualSocialInsurance)} 円/年</dd>
        </dl>
        <p className="text-xs text-gray-500">※賞与は別途、賞与額×料率で計算されます</p>
      </div>

      {/* 事業主負担分 */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-blue-700">参考: 事業主負担分</h3>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-gray-600">健康保険料（事業主分）</dt>
          <dd className="text-right font-medium">{fmt(employerSide.health)} 円/月</dd>
          <dt className="text-gray-600">厚生年金保険料（事業主分）</dt>
          <dd className="text-right font-medium">{fmt(employerSide.pension)} 円/月</dd>
          <dt className="text-gray-600">子ども・子育て拠出金</dt>
          <dd className="text-right font-medium">{fmt(employerSide.childCare)} 円/月</dd>
          <dt className="text-gray-600">子ども・子育て支援金（事業主分）</dt>
          <dd className="text-right font-medium">{fmt(employerSide.childCareSupport)} 円/月</dd>
        </dl>
        <p className="text-xs text-gray-500">※子ども・子育て拠出金は事業主のみの負担（0.36%）</p>
        <p className="text-xs text-gray-500">※子ども・子育て支援金は労使折半（0.23%）・2026年度新設</p>
      </div>
    </section>
  );
}
