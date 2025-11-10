"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useDishListQuery } from "@/queries/useDish";
import { formatCurrency } from "@/lib/utils";
import { ChefHat, CheckCircle, AlertTriangle, DollarSign } from "lucide-react";

export default function DishStatsClient() {
  const dishListQuery = useDishListQuery();
  const data = dishListQuery.data?.payload.data ?? [];

  const totalDishes = data.length;
  const availableDishes = data.filter(
    (dish) => dish.status === "Available"
  ).length;
  const unavailableDishes = data.filter(
    (dish) => dish.status === "Unavailable"
  ).length;
  const hiddenDishes = data.filter((dish) => dish.status === "Hidden").length;
  const averagePrice =
    data.length > 0
      ? data.reduce((sum, dish) => sum + dish.price, 0) / data.length
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {/* Tổng món ăn */}
      <Card className="border-0 shadow-sm bg-card/50 dark:bg-card/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground">
                Tổng món ăn
              </p>
              <h3 className="text-xl font-bold text-foreground">
                {totalDishes}
              </h3>
            </div>
            <div className="rounded-full p-2 bg-orange-100 dark:bg-orange-500/20">
              <ChefHat className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Có sẵn */}
      <Card className="border-0 shadow-sm bg-card/50 dark:bg-card/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground">
                Có sẵn
              </p>
              <h3 className="text-xl font-bold text-foreground">
                {availableDishes}
              </h3>
            </div>
            <div className="rounded-full p-2 bg-green-100 dark:bg-green-500/20">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hết hàng */}
      <Card className="border-0 shadow-sm bg-card/50 dark:bg-card/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground">
                Hết hàng
              </p>
              <h3 className="text-xl font-bold text-foreground">
                {unavailableDishes}
              </h3>
            </div>
            <div className="rounded-full p-2 bg-yellow-100 dark:bg-yellow-500/20">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Giá trung bình */}
      <Card className="border-0 shadow-sm bg-card/50 dark:bg-card/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground">
                Giá trung bình
              </p>
              <h3 className="text-xl font-bold text-foreground">
                {averagePrice > 0
                  ? formatCurrency(Math.round(averagePrice))
                  : "--"}
              </h3>
            </div>
            <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-500/20">
              <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
