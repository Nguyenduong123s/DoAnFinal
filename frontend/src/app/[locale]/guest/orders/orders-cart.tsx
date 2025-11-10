"use client";

import { useAppStore } from "@/components/app-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { OrderStatus } from "@/constants/type";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestGetOrderListQuery } from "@/queries/useGuest";
import {
  PayGuestOrdersResType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { Link } from "@/navigation";
import {
  Plus,
  Menu,
  ShoppingCart,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  CreditCard,
  User,
  CalendarDays,
  Timer,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const getStatusColor = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
  switch (status) {
    case OrderStatus.Pending:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700";
    case OrderStatus.Processing:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-700";
    case OrderStatus.Delivered:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-700";
    case OrderStatus.Paid:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-700";
    case OrderStatus.Rejected:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-700";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700";
  }
};

const getStatusIcon = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
  switch (status) {
    case OrderStatus.Pending:
      return <Clock className="w-4 h-4" />;
    case OrderStatus.Processing:
      return <Timer className="w-4 h-4 animate-spin" />;
    case OrderStatus.Delivered:
      return <CheckCircle2 className="w-4 h-4" />;
    case OrderStatus.Paid:
      return <CreditCard className="w-4 h-4" />;
    case OrderStatus.Rejected:
      return <XCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getProgressValue = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
  switch (status) {
    case OrderStatus.Pending:
      return 25;
    case OrderStatus.Processing:
      return 50;
    case OrderStatus.Delivered:
      return 75;
    case OrderStatus.Paid:
      return 100;
    case OrderStatus.Rejected:
      return 0;
    default:
      return 0;
  }
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getEstimatedTime = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
  switch (status) {
    case OrderStatus.Pending:
      return "5-10 phút";
    case OrderStatus.Processing:
      return "10-15 phút";
    case OrderStatus.Delivered:
      return "Hoàn thành";
    case OrderStatus.Paid:
      return "Đã thanh toán";
    case OrderStatus.Rejected:
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};

export default function OrdersCart() {
  const { data, refetch } = useGuestGetOrderListQuery();
  const orders = useMemo(() => data?.payload.data ?? [], [data]);
  const socket = useAppStore((state) => state.socket);

  const { waitingForPaying, paid } = useMemo(() => {
    return orders.reduce(
      (result, order) => {
        if (
          order.status === OrderStatus.Delivered ||
          order.status === OrderStatus.Processing ||
          order.status === OrderStatus.Pending
        ) {
          return {
            ...result,
            waitingForPaying: {
              price:
                result.waitingForPaying.price +
                order.dishSnapshot.price * order.quantity,
              quantity: result.waitingForPaying.quantity + order.quantity,
            },
          };
        }
        if (order.status === OrderStatus.Paid) {
          return {
            ...result,
            paid: {
              price:
                result.paid.price + order.dishSnapshot.price * order.quantity,
              quantity: result.paid.quantity + order.quantity,
            },
          };
        }
        return result;
      },
      {
        waitingForPaying: {
          price: 0,
          quantity: 0,
        },
        paid: {
          price: 0,
          quantity: 0,
        },
      }
    );
  }, [orders]);

  useEffect(() => {
    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket?.id);
    }

    function onDisconnect() {
      console.log("disconnect");
    }

    function onUpdateOrder(data: UpdateOrderResType["data"]) {
      const {
        dishSnapshot: { name },
        quantity,
      } = data;
      toast({
        description: `Món ${name} (SL: ${quantity}) vừa được cập nhật sang trạng thái "${getVietnameseOrderStatus(
          data.status
        )}"`,
      });
      refetch();
    }

    function onPayment(data: PayGuestOrdersResType["data"]) {
      const { guest } = data[0];
      toast({
        description: `${guest?.name} tại bàn ${guest?.tableNumber} thanh toán thành công ${data.length} đơn`,
      });
      refetch();
    }

    socket?.on("update-order", onUpdateOrder);
    socket?.on("payment", onPayment);
    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("update-order", onUpdateOrder);
      socket?.off("payment", onPayment);
    };
  }, [refetch, socket]);

  if (orders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <ShoppingCart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Chưa có đơn hàng nào
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            Bạn chưa đặt món ăn nào. Hãy khám phá thực đơn phong phú của chúng
            tôi!
          </p>

          <Link href="/guest/menu">
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Menu className="w-4 h-4 mr-2" />
              Khám phá thực đơn
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with Menu Link - Fixed */}
      <div className="flex-shrink-0 flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Đơn hàng của bạn
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {orders.length} món • Cập nhật tự động
          </p>
        </div>
        <Link href="/guest/menu">
          <Button
            variant="outline"
            size="sm"
            className="text-orange-600 border-orange-300 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-600 dark:hover:bg-orange-950 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Gọi thêm món
          </Button>
        </Link>
      </div>

      {/* Main Content Area - Flexible with proper grid layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Orders List - Takes 2/3 on large screens */}
        <div className="lg:col-span-2 flex flex-col overflow-hidden">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Danh sách đơn hàng
          </h3>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {orders.map((order, index) => (
              <Card
                key={order.id}
                className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800 overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Compact Order Header */}
                  <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-900 dark:text-white">
                            Đơn #{order.id}
                          </p>
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>
                              {formatTime(order.createdAt.toString())}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Badge
                        className={`${getStatusColor(
                          order.status
                        )} flex items-center space-x-1 px-2 py-1 border text-xs`}
                      >
                        {getStatusIcon(order.status)}
                        <span>{getVietnameseOrderStatus(order.status)}</span>
                      </Badge>
                    </div>

                    {/* Compact Progress Bar */}
                    <div className="mt-2">
                      <Progress
                        value={getProgressValue(order.status)}
                        className="h-1"
                      />
                    </div>
                  </div>

                  {/* Compact Order Content */}
                  <div className="p-3">
                    <div className="flex gap-3 items-center">
                      {/* Compact Dish Image */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <Image
                            src={order.dishSnapshot.image}
                            alt={order.dishSnapshot.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            quality={100}
                          />
                        </div>
                      </div>

                      {/* Compact Dish Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                          {order.dishSnapshot.name}
                        </h4>

                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
                            <span>
                              {formatCurrency(order.dishSnapshot.price)}
                            </span>
                            <span>×</span>
                            <Badge variant="secondary" className="text-xs px-1">
                              {order.quantity}
                            </Badge>
                          </div>
                          <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                            {formatCurrency(
                              order.dishSnapshot.price * order.quantity
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary Sidebar - Takes 1/3 on large screens */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Tổng quan đơn hàng
          </h3>

          {/* Summary Cards */}
          {waitingForPaying.quantity > 0 && (
            <Card className="border-2 border-yellow-200 dark:border-yellow-800 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-yellow-800 dark:text-yellow-200">
                        Chờ thanh toán
                      </h4>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        {waitingForPaying.quantity} món
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
                      {formatCurrency(waitingForPaying.price)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {paid.quantity > 0 && (
            <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-green-800 dark:text-green-200">
                        Đã thanh toán
                      </h4>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        {paid.quantity} món
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-800 dark:text-green-200">
                      {formatCurrency(paid.price)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Menu Link */}
          <div className="mt-auto">
            <Link href="/guest/menu">
              <Button
                variant="ghost"
                className="w-full text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/30"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Gọi thêm món
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              Cập nhật tự động
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
