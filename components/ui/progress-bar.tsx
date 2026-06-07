"use client";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: "blue" | "green" | "orange" | "red";
}

export function ProgressBar({ value, max = 100, className, color = "blue" }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const colorClasses = {
    blue: "bg-primary-600",
    green: "bg-green-600",
    orange: "bg-construction-orange",
    red: "bg-construction-red",
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div
        className={`${colorClasses[color]} h-2.5 rounded-full transition-all`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}