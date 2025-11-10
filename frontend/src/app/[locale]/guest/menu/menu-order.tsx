"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDishListQuery } from "@/queries/useDish";
import { cn, formatCurrency, handleErrorApi } from "@/lib/utils";
import Quantity from "@/app/[locale]/guest/menu/quantity";
import { useMemo, useState } from "react";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import { useGuestOrderMutation } from "@/queries/useGuest";
import { DishStatus } from "@/constants/type";
import { useRouter } from "@/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Receipt,
  ArrowLeft,
} from "lucide-react";
import { Link } from "@/navigation";

export default function MenuOrder() {
  const { data } = useDishListQuery();
  const dishes = useMemo(() => data?.payload.data ?? [], [data]);
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);
  const { mutateAsync } = useGuestOrderMutation();
  const router = useRouter();

  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id);
      if (!order) return result;
      return result + order.quantity * dish.price;
    }, 0);
  }, [dishes, orders]);

  const totalItems = useMemo(() => {
    return orders.reduce((total, order) => total + order.quantity, 0);
  }, [orders]);

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId);
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId);
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }];
      }
      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };

  const handleOrder = async () => {
    try {
      await mutateAsync(orders);
      router.push(`/guest/orders`);
    } catch (error) {
      handleErrorApi({
        error,
      });
    }
  };

  const availableDishes = dishes.filter(
    (dish) => dish.status !== DishStatus.Hidden
  );

  return (
    <div className="h-full flex flex-col">
      {/* Add Orders Link at the top */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Thực đơn
        </h2>
        <Link href="/guest/orders">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-950"
          >
            <Receipt className="w-4 h-4 mr-2" />
            Xem đơn hàng
          </Button>
        </Link>
      </div>

      {/* Dishes List - Scrollable */}
      <div className="flex-1 overflow-y-auto -mx-4 px-4 pb-4">
        <div className="space-y-3">
          {availableDishes.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Hiện tại chưa có món ăn nào
              </p>
            </div>
          ) : (
            availableDishes.map((dish) => {
              const orderQuantity =
                orders.find((order) => order.dishId === dish.id)?.quantity ?? 0;
              const isUnavailable = dish.status === DishStatus.Unavailable;

              return (
                <Card
                  key={dish.id}
                  className={cn(
                    "border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800",
                    {
                      "opacity-60 bg-gray-50 dark:bg-gray-900": isUnavailable,
                      "ring-2 ring-orange-500 ring-opacity-50 shadow-md":
                        orderQuantity > 0,
                    }
                  )}
                >
                  <CardContent className="p-3">
                    <div className="flex gap-3 items-center">
                      {/* Dish Image - Compact */}
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <Image
                            src={dish.image}
                            alt={dish.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                            quality={100}
                          />
                        </div>

                        {isUnavailable && (
                          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <Badge
                              variant="destructive"
                              className="text-xs px-1 py-0"
                            >
                              Hết
                            </Badge>
                          </div>
                        )}

                        {orderQuantity > 0 && !isUnavailable && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {orderQuantity}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Dish Info - Compact */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight truncate">
                              {dish.name}
                            </h3>

                            {dish.description && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5">
                                {dish.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between mt-1">
                              <span className="text-base font-bold text-orange-600 dark:text-orange-400">
                                {formatCurrency(dish.price)}
                              </span>

                              {dish.status === DishStatus.Available && (
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-1.5 py-0"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Có sẵn
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls - Compact */}
                          <div className="flex-shrink-0 ml-2">
                            {!isUnavailable && (
                              <Quantity
                                onChange={(value) =>
                                  handleQuantityChange(dish.id, value)
                                }
                                value={orderQuantity}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Order Summary & Checkout - Fixed Bottom */}
      {orders.length > 0 && (
        <div className="flex-shrink-0 pt-3 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm -mx-4 px-4">
          {/* Compact Order Summary */}
          <div className="mb-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {totalItems} món
                </span>
              </div>
              <span className="font-bold text-orange-700 dark:text-orange-300 text-base">
                {formatCurrency(totalPrice)}
              </span>
            </div>

            {/* Compact Order Items Preview */}
            <div className="space-y-1 max-h-16 overflow-y-auto">
              {orders.slice(0, 2).map((order) => {
                const dish = dishes.find((d) => d.id === order.dishId);
                if (!dish) return null;

                return (
                  <div
                    key={order.dishId}
                    className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400"
                  >
                    <span className="truncate flex-1">
                      {dish.name} × {order.quantity}
                    </span>
                    <span className="font-medium ml-2">
                      {formatCurrency(dish.price * order.quantity)}
                    </span>
                  </div>
                );
              })}

              {orders.length > 2 && (
                <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
                  +{orders.length - 2} món khác...
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 mb-2">
            {/* Compact Checkout Button */}
            <Button
              onClick={handleOrder}
              disabled={orders.length === 0}
              className="w-full h-11 text-base font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              <div className="flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Đặt hàng</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </Button>

            {/* Link to Orders */}
            <Link href="/guest/orders">
              <Button
                variant="ghost"
                className="w-full text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay về đơn hàng để xem trạng thái
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Empty State for Orders */}
      {orders.length === 0 && availableDishes.length > 0 && (
        <div className="flex-shrink-0 text-center py-6 border-t border-gray-200 dark:border-gray-700 -mx-4">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
            <ShoppingCart className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
            Chọn món ăn để thêm vào đơn hàng
          </p>

          {/* Link to Orders in Empty State */}
          <Link href="/guest/orders">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Receipt className="w-4 h-4 mr-2" />
              Xem đơn hàng hiện tại
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
