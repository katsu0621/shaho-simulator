import { useState, useCallback } from "react";

interface NumericInputProps {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

/**
 * 数値入力コンポーネント
 * - フォーカス時: 値が0なら空欄にして入力しやすくする
 * - ブラー時: 空欄やNaNなら0に戻す
 */
export default function NumericInput({ value, onChange, step, min, disabled, className, placeholder }: NumericInputProps) {
  const [editing, setEditing] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  const handleFocus = useCallback(() => {
    setEditing(true);
    setDisplayValue(value === 0 ? "" : String(value));
  }, [value]);

  const handleBlur = useCallback(() => {
    setEditing(false);
    const parsed = Number(displayValue);
    if (displayValue === "" || isNaN(parsed)) {
      onChange(0);
    }
  }, [displayValue, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);
    const parsed = Number(raw);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  }, [onChange]);

  return (
    <input
      type="number"
      value={editing ? displayValue : value}
      step={step}
      min={min}
      disabled={disabled}
      placeholder={placeholder}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={editing ? handleChange : (e) => onChange(Number(e.target.value))}
      className={className}
    />
  );
}
