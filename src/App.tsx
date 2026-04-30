import { useMemo, useState } from "react";
import { simulate } from "./lib/calc";
import type { MonthInput, OvertimeMode } from "./lib/calc";
import BasicInfo from "./components/BasicInfo";
import MonthlyInput from "./components/MonthlyInput";
import ResultPanel from "./components/ResultPanel";

const defaultMonth: MonthInput = {
  baseSalary: 250000,
  overtimeHours: 0,
  commute: 0,
  otherAllowance: 0,
};

export default function App() {
  const [prefectureName, setPrefectureName] = useState("東京");
  const [hasCareInsurance, setHasCareInsurance] = useState(false);
  const [scheduledHours, setScheduledHours] = useState(160);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState(1.25);
  const [overtimeMode, setOvertimeMode] = useState<OvertimeMode>("働いた月の単価");
  const [marchBase, setMarchBase] = useState(250000);
  const [marchOvertimeHours, setMarchOvertimeHours] = useState(0);
  const [april, setApril] = useState<MonthInput>({ ...defaultMonth });
  const [may, setMay] = useState<MonthInput>({ ...defaultMonth });
  const [june, setJune] = useState<MonthInput>({ ...defaultMonth });

  const result = useMemo(
    () =>
      simulate({
        prefectureName,
        hasCareInsurance,
        scheduledHours,
        overtimeMultiplier,
        overtimeMode,
        marchBase,
        marchOvertimeHours,
        april,
        may,
        june,
      }),
    [prefectureName, hasCareInsurance, scheduledHours, overtimeMultiplier, overtimeMode, marchBase, marchOvertimeHours, april, may, june]
  );

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
        marchOvertimeHours={marchOvertimeHours}
        setMarchOvertimeHours={setMarchOvertimeHours}
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
      />

      <ResultPanel result={result} hasCareInsurance={hasCareInsurance} />

      <footer className="text-center text-xs text-gray-400 border-t pt-4 space-y-1">
        <p>※本ツールは概算です。実際の保険料は加入する健保組合の決定によります</p>
        <p>料率は2026年度（令和8年度）協会けんぽ適用</p>
      </footer>
    </div>
  );
}
