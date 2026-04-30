import { PREFECTURES } from "../data/prefectures";
import type { OvertimeMode } from "../lib/calc";
import NumericInput from "./NumericInput";

interface BasicInfoProps {
  prefectureName: string;
  setPrefectureName: (v: string) => void;
  hasCareInsurance: boolean;
  setHasCareInsurance: (v: boolean) => void;
  scheduledHours: number;
  setScheduledHours: (v: number) => void;
  overtimeMultiplier: number;
  setOvertimeMultiplier: (v: number) => void;
  overtimeMode: OvertimeMode;
  setOvertimeMode: (v: OvertimeMode) => void;
  marchBase: number;
  setMarchBase: (v: number) => void;
  marchOvertimeHours: number;
  setMarchOvertimeHours: (v: number) => void;
}

export default function BasicInfo(props: BasicInfoProps) {
  const {
    prefectureName, setPrefectureName,
    hasCareInsurance, setHasCareInsurance,
    scheduledHours, setScheduledHours,
    overtimeMultiplier, setOvertimeMultiplier,
    overtimeMode, setOvertimeMode,
    marchBase, setMarchBase,
    marchOvertimeHours, setMarchOvertimeHours,
  } = props;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">基本情報</h2>

      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-center">
        {/* 都道府県 */}
        <label className="text-sm font-medium">都道府県</label>
        <select
          value={prefectureName}
          onChange={(e) => setPrefectureName(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {PREFECTURES.map((p) => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>

        {/* 介護保険対象 */}
        <label className="text-sm font-medium">介護保険対象</label>
        <select
          value={hasCareInsurance ? "true" : "false"}
          onChange={(e) => setHasCareInsurance(e.target.value === "true")}
          className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="false">対象外</option>
          <option value="true">対象（40-64歳）</option>
        </select>

        {/* 月の所定労働時間 */}
        <label className="text-sm font-medium">月の所定労働時間</label>
        <div className="flex items-center gap-2">
          <NumericInput
            value={scheduledHours}
            step={0.1}
            min={0}
            onChange={setScheduledHours}
            className="w-32 rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <span className="text-sm text-gray-600">時間</span>
        </div>

        {/* 残業割増率 */}
        <label className="text-sm font-medium">残業割増率</label>
        <NumericInput
          value={overtimeMultiplier}
          step={0.05}
          min={1}
          onChange={setOvertimeMultiplier}
          placeholder="通常1.25 / 深夜1.5 / 休日1.35"
          className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* 残業代計算方式 */}
        <label className="text-sm font-medium">残業代計算方式</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input
              type="radio"
              name="overtimeMode"
              checked={overtimeMode === "働いた月の単価"}
              onChange={() => setOvertimeMode("働いた月の単価")}
              className="accent-blue-600"
            />
            働いた月の単価
          </label>
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input
              type="radio"
              name="overtimeMode"
              checked={overtimeMode === "支払月の単価"}
              onChange={() => setOvertimeMode("支払月の単価")}
              className="accent-blue-600"
            />
            支払月の単価
          </label>
        </div>

        {/* 3月の基本給・残業時間（条件付き表示） */}
        {overtimeMode === "働いた月の単価" && (
          <>
            <label className="text-sm font-medium">3月の基本給</label>
            <div className="flex items-center gap-2">
              <NumericInput
                value={marchBase}
                min={0}
                onChange={setMarchBase}
                className="w-40 rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-sm text-gray-600">円</span>
            </div>

            <label className="text-sm font-medium">3月の残業時間</label>
            <div className="flex items-center gap-2">
              <NumericInput
                value={marchOvertimeHours}
                step={0.25}
                min={0}
                onChange={setMarchOvertimeHours}
                className="w-32 rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-sm text-gray-600">時間</span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
