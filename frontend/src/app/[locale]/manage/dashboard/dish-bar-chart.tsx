"use client";

import { BarChart3, Utensils } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DashboardIndicatorResType } from "@/schemaValidations/indicator.schema";
import { useMemo } from "react";

const colors = [
  "rgb(34, 197, 94)", // green-500
  "rgb(59, 130, 246)", // blue-500
  "rgb(168, 85, 247)", // purple-500
  "rgb(249, 115, 22)", // orange-500
  "rgb(239, 68, 68)", // red-500
  "rgb(6, 182, 212)", // cyan-500
  "rgb(245, 158, 11)", // amber-500
  "rgb(139, 69, 19)", // brown-500
];

const chartConfig = {
  successOrders: {
    label: "Đơn thành công",
  },
} satisfies ChartConfig;

export function DishBarChart({
  chartData,
}: {
  chartData: Pick<
    DashboardIndicatorResType["data"]["dishIndicator"][0],
    "name" | "successOrders"
  >[];
}) {
  const chartDataWithColors = useMemo(
    () =>
      chartData.map((data, index) => {
        return {
          ...data,
          fill: colors[index % colors.length],
        };
      }),
    [chartData]
  );

  return (
    <div className="space-y-4">
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">Chưa có dữ liệu</p>
            <p className="text-sm">
              Thống kê món ăn sẽ hiển thị khi có đơn hàng
            </p>
          </div>
        </div>
      ) : (
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartDataWithColors}
            layout="vertical"
            margin={{
              left: 10,
              right: 10,
              top: 10,
              bottom: 10,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={100}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                // Truncate long names
                return value.length > 15
                  ? value.substring(0, 15) + "..."
                  : value;
              }}
            />
            <XAxis dataKey="successOrders" type="number" hide />
            <ChartTooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {label}
                      </p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">
                        Đơn thành công:{" "}
                        <span className="font-semibold">
                          {payload[0].value}
                        </span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="successOrders"
              name="Đơn thành công"
              layout="vertical"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      )}

      {chartData.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Utensils className="w-4 h-4" />
          <span>Top {chartData.length} món ăn phổ biến</span>
        </div>
      )}
    </div>
  );
}
