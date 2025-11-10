"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format, parse } from "date-fns";
import { DashboardIndicatorResType } from "@/schemaValidations/indicator.schema";
import { formatCurrency } from "@/lib/utils";

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function RevenueLineChart({
  chartData,
}: {
  chartData: DashboardIndicatorResType["data"]["revenueByDate"];
}) {
  return (
    <div className="space-y-4">
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">Chưa có dữ liệu</p>
            <p className="text-sm">
              Dữ liệu doanh thu sẽ hiển thị khi có đơn hàng
            </p>
          </div>
        </div>
      ) : (
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.5}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (chartData.length < 8) {
                  return value;
                }
                if (chartData.length < 33) {
                  const date = parse(value, "dd/MM/yyyy", new Date());
                  return format(date, "dd");
                }
                return "";
              }}
            />
            <ChartTooltip
              cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Ngày: {label}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Doanh thu:{" "}
                        <span className="font-semibold">
                          {formatCurrency(payload[0].value as number)}
                        </span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              dataKey="revenue"
              name="Doanh thu"
              type="monotone"
              stroke="rgb(59, 130, 246)"
              strokeWidth={3}
              dot={{
                fill: "rgb(59, 130, 246)",
                strokeWidth: 2,
                stroke: "white",
                r: 4,
              }}
              activeDot={{
                r: 6,
                stroke: "rgb(59, 130, 246)",
                strokeWidth: 2,
                fill: "white",
              }}
            />
          </LineChart>
        </ChartContainer>
      )}

      {chartData.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>Tổng {chartData.length} ngày có dữ liệu</span>
        </div>
      )}
    </div>
  );
}
