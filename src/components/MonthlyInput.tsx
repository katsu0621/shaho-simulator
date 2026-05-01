import { useState } from "react";
import type { MonthInput, OvertimeMode } from "../lib/calc";
import NumericInput from "./NumericInput";

interface MonthlyInputProps {
  april: MonthInput;
  may: MonthInput;
  june: MonthInput;
  setApril: (v: MonthInput) => void;
  setMay: (v: MonthInput) => void;
  setJune: (v: MonthInput) => void;
  overtimePay: { april: number; may: number; june: number };
  monthlyTotals: { april: number; may: number; june: number };
  overtimeMode: OvertimeMode;
  onCopyApril: () => void;
}

const fmt = (n: number) => new Intl.NumberFormat("ja-JP").format(n);

type MonthKey = "april" | "may" | "june";

export default function MonthlyInput(props: MonthlyInputProps) {
  const { april, may, june, setApril, setMay, setJune, overtimePay, monthlyTotals, overtimeMode, onCopyApril } = props;
  const isWorkedMonth = overtimeMode === "働いた月の単価";
  const [detailOpen, setDetailOpen] = useState(false);

  const months: { key: MonthKey; label: string; data: MonthInput; set: (v: MonthInput) => void }[] = [
    { key: "april", label: "4月", data: april, set: setApril },
    { key: "may",   label: "5月", data: may,   set: setMay },
    { key: "june",  label: "6月", data: june,  set: setJune },
  ];

  const inputClass = "w-full rounded border border-gray-300 px-2 py-1 text-right focus:ring-2 focus:ring-blue-500 focus:outline-none";
  const disabledClass = "w-full rounded border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed px-2 py-1 text-right";

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-lg font-semibold">月別給与入力（4・5・6月）</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[480px]">
          <thead>
            <tr className="bg-blue-50">
              <th className="text-left px-3 py-2 border border-gray-200 w-28">項目</th>
              {months.map((m) => (
                <th key={m.key} className="text-center px-3 py-2 border border-gray-200">{m.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 基本給 + 一括反映ボタン */}
            <tr>
              <td className="px-3 py-2 border border-gray-200 font-medium">
                基本給<span className="text-xs text-gray-400 ml-1">(円)</span>
              </td>
              {months.map((m) => (
                <td key={m.key} className="px-2 py-1.5 border border-gray-200">
                  <NumericInput
                    value={m.data.baseSalary}
                    min={0}
                    onChange={(v) => m.set({ ...m.data, baseSalary: v })}
                    className={inputClass}
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td colSpan={4} className="px-3 py-1 border border-gray-200">
                <button
                  type="button"
                  onClick={onCopyApril}
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                >
                  4月の基本給を5・6月にも反映
                </button>
              </td>
            </tr>

            {/* 通常残業時間 */}
            <tr>
              <td className="px-3 py-2 border border-gray-200 font-medium">
                残業時間<span className="text-xs text-gray-400 ml-1">(時間)</span>
              </td>
              {months.map((m) => {
                const disabled = isWorkedMonth && m.key === "june";
                return (
                  <td key={m.key} className="px-2 py-1.5 border border-gray-200">
                    <NumericInput
                      value={m.data.overtimeHours}
                      step={0.25}
                      min={0}
                      disabled={disabled}
                      onChange={(v) => m.set({ ...m.data, overtimeHours: v })}
                      className={disabled ? disabledClass : inputClass}
                    />
                  </td>
                );
              })}
            </tr>

            {/* 詳細入力トグル */}
            <tr>
              <td colSpan={4} className="px-3 py-1 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setDetailOpen(!detailOpen)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span className={`transition-transform ${detailOpen ? "rotate-90" : ""}`}>▶</span>
                  残業詳細入力（休日出勤・深夜残業・60H超）
                </button>
              </td>
            </tr>

            {/* 詳細入力: 休日出勤 */}
            {detailOpen && (
              <>
                <tr className="bg-orange-50/50">
                  <td className="px-3 py-2 border border-gray-200 font-medium text-orange-700">
                    休日出勤<span className="text-xs text-gray-400 ml-1">(時間・×1.35)</span>
                  </td>
                  {months.map((m) => {
                    const disabled = isWorkedMonth && m.key === "june";
                    return (
                      <td key={m.key} className="px-2 py-1.5 border border-gray-200">
                        <NumericInput
                          value={m.data.holidayHours}
                          step={0.25}
                          min={0}
                          disabled={disabled}
                          onChange={(v) => m.set({ ...m.data, holidayHours: v })}
                          className={disabled ? disabledClass : inputClass}
                        />
                      </td>
                    );
                  })}
                </tr>

                {/* 詳細入力: 深夜残業 */}
                <tr className="bg-purple-50/50">
                  <td className="px-3 py-2 border border-gray-200 font-medium text-purple-700">
                    深夜残業<span className="text-xs text-gray-400 ml-1">(時間・×1.5)</span>
                  </td>
                  {months.map((m) => {
                    const disabled = isWorkedMonth && m.key === "june";
                    return (
                      <td key={m.key} className="px-2 py-1.5 border border-gray-200">
                        <NumericInput
                          value={m.data.lateNightHours}
                          step={0.25}
                          min={0}
                          disabled={disabled}
                          onChange={(v) => m.set({ ...m.data, lateNightHours: v })}
                          className={disabled ? disabledClass : inputClass}
                        />
                      </td>
                    );
                  })}
                </tr>

                {/* 詳細入力: 60H超残業 */}
                <tr className="bg-red-50/50">
                  <td className="px-3 py-2 border border-gray-200 font-medium text-red-700">
                    60H超<span className="text-xs text-gray-400 ml-1">(時間・×1.5)</span>
                  </td>
                  {months.map((m) => {
                    const disabled = isWorkedMonth && m.key === "june";
                    return (
                      <td key={m.key} className="px-2 py-1.5 border border-gray-200">
                        <NumericInput
                          value={m.data.over60Hours}
                          step={0.25}
                          min={0}
                          disabled={disabled}
                          onChange={(v) => m.set({ ...m.data, over60Hours: v })}
                          className={disabled ? disabledClass : inputClass}
                        />
                      </td>
                    );
                  })}
                </tr>

                {/* 詳細入力: 60H超休日 */}
                <tr className="bg-red-50/50">
                  <td className="px-3 py-2 border border-gray-200 font-medium text-red-700">
                    休日60H超<span className="text-xs text-gray-400 ml-1">(時間・×1.6)</span>
                  </td>
                  {months.map((m) => {
                    const disabled = isWorkedMonth && m.key === "june";
                    return (
                      <td key={m.key} className="px-2 py-1.5 border border-gray-200">
                        <NumericInput
                          value={m.data.over60HolidayHours}
                          step={0.25}
                          min={0}
                          disabled={disabled}
                          onChange={(v) => m.set({ ...m.data, over60HolidayHours: v })}
                          className={disabled ? disabledClass : inputClass}
                        />
                      </td>
                    );
                  })}
                </tr>
              </>
            )}

            {/* 読み取り専用行: 残業代 */}
            <tr className="bg-gray-50">
              <td className="px-3 py-2 border border-gray-200 font-medium">
                残業代<span className="text-xs text-gray-400 ml-1">(円)</span>
              </td>
              {months.map((m) => (
                <td key={m.key} className="px-3 py-2 border border-gray-200 text-right tabular-nums">
                  {fmt(overtimePay[m.key])}
                </td>
              ))}
            </tr>

            {/* 通勤手当 */}
            <tr>
              <td className="px-3 py-2 border border-gray-200 font-medium">
                通勤手当<span className="text-xs text-gray-400 ml-1">(円)</span>
              </td>
              {months.map((m) => (
                <td key={m.key} className="px-2 py-1.5 border border-gray-200">
                  <NumericInput
                    value={m.data.commute}
                    min={0}
                    onChange={(v) => m.set({ ...m.data, commute: v })}
                    className={inputClass}
                  />
                </td>
              ))}
            </tr>

            {/* その他手当 */}
            <tr>
              <td className="px-3 py-2 border border-gray-200 font-medium">
                その他手当<span className="text-xs text-gray-400 ml-1">(円)</span>
              </td>
              {months.map((m) => (
                <td key={m.key} className="px-2 py-1.5 border border-gray-200">
                  <NumericInput
                    value={m.data.otherAllowance}
                    min={0}
                    onChange={(v) => m.set({ ...m.data, otherAllowance: v })}
                    className={inputClass}
                  />
                </td>
              ))}
            </tr>

            {/* 読み取り専用行: 月額合計 */}
            <tr className="bg-blue-50 font-semibold">
              <td className="px-3 py-2 border border-gray-200">
                月額合計<span className="text-xs text-gray-400 ml-1">(円)</span>
              </td>
              {months.map((m) => (
                <td key={m.key} className="px-3 py-2 border border-gray-200 text-right tabular-nums">
                  {fmt(monthlyTotals[m.key])}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
