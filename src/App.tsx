import { useCallback, useEffect, useMemo, useState } from "react";
import { simulate } from "./lib/calc";
import type { MonthInput, OvertimeMode, MarchOvertime } from "./lib/calc";
import BasicInfo from "./components/BasicInfo";
import MonthlyInput from "./components/MonthlyInput";
import ResultPanel from "./components/ResultPanel";

const STORAGE_KEY = "shaho-simulator-data";

const defaultMonth: MonthInput = {
  baseSalary: 250000,
  overtimeHours: 0,
  holidayHours: 0,
  lateNightHours: 0,
  over60Hours: 0,
  over60HolidayHours: 0,
  commute: 0,
  otherAllowance: 0,
};

const defaultMarchOvertime: MarchOvertime = {
  overtimeHours: 0,
  holidayHours: 0,
  lateNightHours: 0,
  over60Hours: 0,
  over60HolidayHours: 0,
};

interface SavedState {
  prefectureName: string;
  hasCareInsurance: boolean;
  scheduledHours: number;
  overtimeMultiplier: number;
  overtimeMode: OvertimeMode;
  marchBase: number;
  marchOvertime: MarchOvertime;
  april: MonthInput;
  may: MonthInput;
  june: MonthInput;
}

const defaultState: SavedState = {
  prefectureName: "東京",
  hasCareInsurance: false,
  scheduledHours: 160,
  overtimeMultiplier: 1.25,
  overtimeMode: "働いた月の単価",
  marchBase: 250000,
  marchOvertime: { ...defaultMarchOvertime },
  april: { ...defaultMonth },
  may: { ...defaultMonth },
  june: { ...defaultMonth },
};

function loadState(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    // デフォルト値とマージして、新しいフィールドが追加されても壊れないようにする
    return {
      ...defaultState,
      ...parsed,
      marchOvertime: { ...defaultMarchOvertime, ...parsed.marchOvertime },
      april: { ...defaultMonth, ...parsed.april },
      may: { ...defaultMonth, ...parsed.may },
      june: { ...defaultMonth, ...parsed.june },
    };
  } catch {
    return defaultState;
  }
}

export default function App() {
  const initial = loadState();
  const [prefectureName, setPrefectureName] = useState(initial.prefectureName);
  const [hasCareInsurance, setHasCareInsurance] = useState(initial.hasCareInsurance);
  const [scheduledHours, setScheduledHours] = useState(initial.scheduledHours);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState(initial.overtimeMultiplier);
  const [overtimeMode, setOvertimeMode] = useState<OvertimeMode>(initial.overtimeMode);
  const [marchBase, setMarchBase] = useState(initial.marchBase);
  const [marchOvertime, setMarchOvertime] = useState<MarchOvertime>(initial.marchOvertime);
  const [april, setApril] = useState<MonthInput>(initial.april);
  const [may, setMay] = useState<MonthInput>(initial.may);
  const [june, setJune] = useState<MonthInput>(initial.june);

  // 入力値が変わるたびにlocalStorageに保存
  useEffect(() => {
    const state: SavedState = {
      prefectureName, hasCareInsurance, scheduledHours, overtimeMultiplier,
      overtimeMode, marchBase, marchOvertime, april, may, june,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [prefectureName, hasCareInsurance, scheduledHours, overtimeMultiplier, overtimeMode, marchBase, marchOvertime, april, may, june]);

  const result = useMemo(
    () =>
      simulate({
        prefectureName, hasCareInsurance, scheduledHours, overtimeMultiplier,
        overtimeMode, marchBase, marchOvertime, april, may, june,
      }),
    [prefectureName, hasCareInsurance, scheduledHours, overtimeMultiplier, overtimeMode, marchBase, marchOvertime, april, may, june]
  );

  const copyAprilToMayJune = () => {
    setMay((prev) => ({ ...prev, baseSalary: april.baseSalary }));
    setJune((prev) => ({ ...prev, baseSalary: april.baseSalary }));
  };

  const resetAll = useCallback(() => {
    setPrefectureName(defaultState.prefectureName);
    setHasCareInsurance(defaultState.hasCareInsurance);
    setScheduledHours(defaultState.scheduledHours);
    setOvertimeMultiplier(defaultState.overtimeMultiplier);
    setOvertimeMode(defaultState.overtimeMode);
    setMarchBase(defaultState.marchBase);
    setMarchOvertime({ ...defaultMarchOvertime });
    setApril({ ...defaultMonth });
    setMay({ ...defaultMonth });
    setJune({ ...defaultMonth });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">社会保険料シミュレーター</h1>
        <p className="text-sm text-gray-500 mt-1">
          協会けんぽ・全国対応／4・5・6月給与から標準報酬月額を算定
        </p>
      </header>

      <BasicInfo
        prefectureName={prefectureName}
        setPrefectureName={setPrefectureName}
        hasCareInsurance={hasCareInsurance}
        setHasCareInsurance={setHasCareInsurance}
        scheduledHours={scheduledHours}
        setScheduledHours={setScheduledHours}
        overtimeMultiplier={overtimeMultiplier}
        setOvertimeMultiplier={setOvertimeMultiplier}
        overtimeMode={overtimeMode}
        setOvertimeMode={setOvertimeMode}
        marchBase={marchBase}
        setMarchBase={setMarchBase}
        marchOvertime={marchOvertime}
        setMarchOvertime={setMarchOvertime}
      />

      <MonthlyInput
        april={april}
        may={may}
        june={june}
        setApril={setApril}
        setMay={setMay}
        setJune={setJune}
        overtimePay={result.overtimePay}
        monthlyTotals={result.monthlyTotals}
        overtimeMode={overtimeMode}
        onCopyApril={copyAprilToMayJune}
      />

      <ResultPanel result={result} hasCareInsurance={hasCareInsurance} />

      <div className="text-center">
        <button
          type="button"
          onClick={resetAll}
          className="text-xs text-gray-400 hover:text-red-500 underline"
        >
          入力をリセット
        </button>
      </div>

      <footer className="text-center text-xs text-gray-400 border-t pt-4 space-y-1">
        <p>※本ツールは概算です。実際の保険料は加入する健保組合の決定によります</p>
        <p>料率は2026年度（令和8年度）協会けんぽ適用</p>
      </footer>
    </div>
  );
}
