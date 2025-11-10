"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueLineChart } from "@/app/[locale]/manage/dashboard/revenue-line-chart";
import { DishBarChart } from "@/app/[locale]/manage/dashboard/dish-bar-chart";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { endOfDay, format, startOfDay } from "date-fns";
import { useState } from "react";
import { useDashboardIndicator } from "@/queries/useIndicator";
import {
  DollarSign,
  Users,
  ShoppingBag,
  Utensils,
  Calendar,
  RotateCcw,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());

export default function DashboardMain() {
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const { data } = useDashboardIndicator({
    fromDate,
    toDate,
  });
  const revenue = data?.payload.data.revenue ?? 0;
  const guestCount = data?.payload.data.guestCount ?? 0;
  const orderCount = data?.payload.data.orderCount ?? 0;
  const servingTableCount = data?.payload.data.servingTableCount ?? 0;
  const revenueByDate = data?.payload.data.revenueByDate ?? [];
  const dishIndicator = data?.payload.data.dishIndicator ?? [];

  const resetDateFilter = () => {
    setFromDate(initFromDate);
    setToDate(initToDate);
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Bộ lọc thời gian
        </h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Từ
            </span>
            <Input
              type="datetime-local"
              className="w-auto text-sm border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={format(fromDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
              onChange={(event) => setFromDate(new Date(event.target.value))}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Đến
            </span>
            <Input
              type="datetime-local"
              className="w-auto text-sm border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={format(toDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
              onChange={(event) => setToDate(new Date(event.target.value))}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetDateFilter}
            className="text-gray-600 hover:text-gray-900 border-gray-300 hover:border-gray-400"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">
              Tổng doanh thu
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(revenue)}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Doanh thu trong khoảng thời gian
            </p>
          </CardContent>
        </Card>

        {/* Guests Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Khách hàng
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {guestCount}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Tổng số khách gọi món
            </p>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">
              Đơn hàng
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
              {orderCount}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Tổng số đơn hàng
            </p>
          </CardContent>
        </Card>

        {/* Serving Tables Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200">
              Bàn đang phục vụ
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Utensils className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
              {servingTableCount}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Số bàn đang có khách
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Biểu đồ doanh thu
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <RevenueLineChart chartData={revenueByDate} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Xếp hạng món ăn
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <DishBarChart chartData={dishIndicator} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
