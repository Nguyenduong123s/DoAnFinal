import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

export default function Quantity({
  onChange,
  value,
}: {
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
      <Button
        className="h-7 w-7 p-0 bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 shadow-sm"
        disabled={value === 0}
        onClick={() => onChange(value - 1)}
        variant="ghost"
      >
        <Minus className="w-3 h-3" />
      </Button>
      <div className="w-8 text-center">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {value}
        </span>
      </div>
      <Button
        className="h-7 w-7 p-0 bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 shadow-sm"
        onClick={() => onChange(value + 1)}
        variant="ghost"
      >
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
}
