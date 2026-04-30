import type { MonthInput, OvertimeMode } from "../lib/calc";

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
}

const fmt = (n: number) => new Intl.NumberFormat("ja-JP").format(n);

type MonthKey = "april" | "may" | "june";
type EditableField = "baseSalary" | "overtimeHours" | "commute" | "otherAllowance";

export default function MonthlyInput(props: MonthlyInputProps) {
  const { april, may, june, setApril, setMay, setJune, overtimePay, monthlyTotals, overtimeMode } = props;
  const isWorkedMonth = overtimeMode === "働いた月の単価";

  const months: { key: MonthKey; label: string; data: MonthInput; set: (v: MonthInput) => void }[] = [
    { key: "april", label: "4月", data: april, set: setApril },
    { key: "may",   label: "5月", data: may,   set: setMay },
    { key: "june",  label: "6月", data: june,  set: setJune },
  ];

  const handleChange = (month: { data: MonthInput; set: (v: MonthInput) => void }, field: EditableField, value: number) => {
    month.set({ ...month.data, [field]: value });
  };

  const rows: { label: string; field: EditableField; unit: string; step?: number }[] = [
    { label: "基本給", field: "baseSalary", unit: "円" },
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">月別給与入力（4・5・6月）</h2>

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
            {/* 編集可能行: 基本給・残業時間 */}
            {rows.map((row) => (
              <tr key={row.field}>
                <td className="px-3 py-2 border border-gray-200 font-medium">
                  {row.label}
                  <span className="text-xs text-gray-400 ml-1">({row.unit})</span>
                </td>
                {months.map((m) => (
                  <td key={m.key} className="px-2 py-1.5 border border-gray-200">
                    <input
                      type="number"
                      value={m.data[row.field]}
                      step={row.step}
                      min={0}
                      onChange={(e) => handleChange(m, row.field, Number(e.target.value))}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-right focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>
                ))}
              </tr>
            ))}

            {/* 残業時間（働いた月の単価モード時、6月はグレーアウト） */}
            <tr>
              <td className="px-3 py-2 border border-gray-200 font-medium">
                残業時間<span className="text-xs text-gray-400 ml-1">(時間)</span>
              </td>
              {months.map((m) => {
                const disabled = isWorkedMonth && m.key === "june";
                return (
                  <td key={m.key} className="px-2 py-1.5 border border-gray-200">
                    <input
                      type="number"
                      value={m.data.overtimeHours}
                      step={0.25}
                      min={0}
                      disabled={disabled}
                      onChange={(e) => handleChange(m, "overtimeHours", Number(e.target.value))}
                      className={`w-full rounded border px-2 py-1 text-right focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                        disabled
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-gray-300"
                      }`}
                    />
                  </td>
                );
              })}
            </tr>

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

            {/* 編集可能行: 通勤手当・その他手当 */}
            {([
              { label: "通勤手当", field: "commute" as EditableField, unit: "円" },
              { label: "その他手当", field: "otherAllowance" as EditableField, unit: "円" },
            ]).map((row) => (
              <tr key={row.field}>
                <td className="px-3 py-2 border border-gray-200 font-medium">
                  {row.label}
                  <span className="text-xs text-gray-400 ml-1">({row.unit})</span>
                </td>
                {months.map((m) => (
                  <td key={m.key} className="px-2 py-1.5 border border-gray-200">
                    <input
                      type="number"
                      value={m.data[row.field]}
                      min={0}
                      onChange={(e) => handleChange(m, row.field, Number(e.target.value))}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-right focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>
                ))}
              </tr>
            ))}

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
