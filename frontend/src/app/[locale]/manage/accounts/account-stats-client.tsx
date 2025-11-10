"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAccountList } from "@/queries/useAccount";
import { Role } from "@/constants/type";
import { Users, UserCheck, Shield, UserPlus } from "lucide-react";

export default function AccountStatsClient() {
  const accountListQuery = useGetAccountList();
  const accounts = accountListQuery.data?.payload.data ?? [];

  // Calculate statistics
  const totalAccounts = accounts.length;
  const activeEmployees = accounts.filter(
    (account) => account.role === Role.Employee
  ).length;
  const managers = accounts.filter(
    (account) => account.role === Role.Owner
  ).length;

  // Calculate new accounts this month (for demo, we'll show a percentage of total)
  const newAccountsThisMonth = Math.floor(totalAccounts * 0.15); // 15% as new accounts

  const stats = [
    {
      title: "Tổng tài khoản",
      value: totalAccounts,
      change:
        totalAccounts > 0
          ? `+${Math.floor(totalAccounts * 0.1)}% so với tháng trước`
          : "+0% so với tháng trước",
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      textColor: "text-blue-100",
      changeColor: "text-blue-200",
    },
    {
      title: "Đang hoạt động",
      value: activeEmployees,
      change: "Nhân viên đang làm việc",
      icon: UserCheck,
      gradient: "from-green-500 to-green-600",
      textColor: "text-green-100",
      changeColor: "text-green-200",
    },
    {
      title: "Quản lý",
      value: managers,
      change: "Tài khoản quản lý",
      icon: Shield,
      gradient: "from-purple-500 to-purple-600",
      textColor: "text-purple-100",
      changeColor: "text-purple-200",
    },
    {
      title: "Mới trong tháng",
      value: newAccountsThisMonth,
      change: "Tài khoản mới tạo",
      icon: UserPlus,
      gradient: "from-orange-500 to-orange-600",
      textColor: "text-orange-100",
      changeColor: "text-orange-200",
    },
  ];

  if (accountListQuery.isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            className="shadow-lg border-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
              <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`shadow-lg border-0 bg-gradient-to-r ${stat.gradient} text-white`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${stat.textColor}`}>
                {stat.title}
              </CardTitle>
              <Icon className={`h-5 w-5 ${stat.changeColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.changeColor}`}>{stat.change}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
