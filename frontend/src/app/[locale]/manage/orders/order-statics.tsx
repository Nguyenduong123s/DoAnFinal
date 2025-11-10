import { Fragment, useState } from "react";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Utensils,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { OrderStatusIcon, cn, getVietnameseOrderStatus } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OrderStatus, OrderStatusValues } from "@/constants/type";
import { TableListResType } from "@/schemaValidations/table.schema";
import { Badge } from "@/components/ui/badge";
import {
  ServingGuestByTableNumber,
  Statics,
  StatusCountObject,
} from "@/app/[locale]/manage/orders/order-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OrderGuestDetail from "@/app/[locale]/manage/orders/order-guest-detail";

export default function OrderStatics({
  statics,
  tableList,
  servingGuestByTableNumber,
}: {
  statics: Statics;
  tableList: TableListResType["data"];
  servingGuestByTableNumber: ServingGuestByTableNumber;
}) {
  const [selectedTableNumber, setSelectedTableNumber] = useState<number>(0);
  const selectedServingGuest = servingGuestByTableNumber[selectedTableNumber];

  return (
    <Fragment>
      <Dialog
        open={Boolean(selectedTableNumber)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTableNumber(0);
          }
        }}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
          {selectedServingGuest && (
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold">
                  Khách đang ngồi tại bàn {selectedTableNumber}
                </span>
              </DialogTitle>
            </DialogHeader>
          )}
          <div className="space-y-6">
            {selectedServingGuest &&
              Object.keys(selectedServingGuest).map((guestId, index) => {
                const orders = selectedServingGuest[Number(guestId)];
                return (
                  <div
                    key={guestId}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <OrderGuestDetail
                      guest={orders[0].guest}
                      orders={orders}
                      onPaySuccess={() => {
                        setSelectedTableNumber(0);
                      }}
                    />
                    {index !== Object.keys(selectedServingGuest).length - 1 && (
                      <Separator className="my-5" />
                    )}
                  </div>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 py-6">
        {tableList.map((table) => {
          const tableNumber: number = table.number;
          const tableStatics: Record<number, StatusCountObject> | undefined =
            statics.table[tableNumber];
          let isEmptyTable = true;
          let countObject: StatusCountObject = {
            Pending: 0,
            Processing: 0,
            Delivered: 0,
            Paid: 0,
            Rejected: 0,
          };
          const servingGuestCount = Object.values(
            servingGuestByTableNumber[tableNumber] ?? []
          ).length;

          if (tableStatics) {
            for (const guestId in tableStatics) {
              const guestStatics = tableStatics[Number(guestId)];
              if (
                [
                  guestStatics.Pending,
                  guestStatics.Processing,
                  guestStatics.Delivered,
                ].some((status) => status !== 0 && status !== undefined)
              ) {
                isEmptyTable = false;
              }
              countObject = {
                Pending: countObject.Pending + (guestStatics.Pending ?? 0),
                Processing:
                  countObject.Processing + (guestStatics.Processing ?? 0),
                Delivered:
                  countObject.Delivered + (guestStatics.Delivered ?? 0),
                Paid: countObject.Paid + (guestStatics.Paid ?? 0),
                Rejected: countObject.Rejected + (guestStatics.Rejected ?? 0),
              };
            }
          }

          return (
            <div
              key={tableNumber}
              className={cn(
                "relative group transition-all duration-200 hover:scale-105 cursor-pointer",
                {
                  "cursor-default": isEmptyTable,
                }
              )}
              onClick={() => {
                if (!isEmptyTable) setSelectedTableNumber(tableNumber);
              }}
            >
              <div
                className={cn(
                  "border-2 rounded-xl p-4 shadow-lg transition-all duration-200",
                  {
                    "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800 hover:shadow-xl":
                      !isEmptyTable,
                    "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-600":
                      isEmptyTable,
                  }
                )}
              >
                {/* Table Number */}
                <div className="text-center mb-3">
                  <div
                    className={cn(
                      "w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold text-lg mb-2",
                      {
                        "bg-gradient-to-r from-emerald-500 to-teal-500 text-white":
                          !isEmptyTable,
                        "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300":
                          isEmptyTable,
                      }
                    )}
                  >
                    {tableNumber}
                  </div>

                  {/* Guest Count */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className={cn(
                            "flex items-center justify-center gap-1 text-sm",
                            {
                              "text-emerald-700 dark:text-emerald-300":
                                !isEmptyTable,
                              "text-gray-500 dark:text-gray-400": isEmptyTable,
                            }
                          )}
                        >
                          <Users className="h-4 w-4" />
                          <span className="font-medium">
                            {servingGuestCount}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        Đang phục vụ: {servingGuestCount} khách
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Status Indicator */}
                {isEmptyTable ? (
                  <div className="text-center">
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-300 bg-green-50 dark:bg-green-950 dark:text-green-400"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Order Status Counts */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-1 justify-center p-1 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                              <Clock className="w-3 h-3" />
                              <span className="font-medium">
                                {countObject[OrderStatus.Pending] ?? 0}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {getVietnameseOrderStatus(OrderStatus.Pending)}:{" "}
                            {countObject[OrderStatus.Pending] ?? 0} đơn
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-1 justify-center p-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                              <Utensils className="w-3 h-3" />
                              <span className="font-medium">
                                {countObject[OrderStatus.Processing] ?? 0}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {getVietnameseOrderStatus(OrderStatus.Processing)}:{" "}
                            {countObject[OrderStatus.Processing] ?? 0} đơn
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-1 justify-center p-1 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                              <CheckCircle className="w-3 h-3" />
                              <span className="font-medium">
                                {countObject[OrderStatus.Delivered] ?? 0}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {getVietnameseOrderStatus(OrderStatus.Delivered)}:{" "}
                            {countObject[OrderStatus.Delivered] ?? 0} đơn
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-1 justify-center p-1 rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                              <CreditCard className="w-3 h-3" />
                              <span className="font-medium">
                                {countObject[OrderStatus.Paid] ?? 0}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {getVietnameseOrderStatus(OrderStatus.Paid)}:{" "}
                            {countObject[OrderStatus.Paid] ?? 0} đơn
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Rejected Orders (if any) */}
                    {(countObject[OrderStatus.Rejected] ?? 0) > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-1 justify-center p-1 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                              <XCircle className="w-3 h-3" />
                              <span className="font-medium">
                                {countObject[OrderStatus.Rejected] ?? 0}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {getVietnameseOrderStatus(OrderStatus.Rejected)}:{" "}
                            {countObject[OrderStatus.Rejected] ?? 0} đơn
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                )}

                {/* Hover Effect Indicator */}
                {!isEmptyTable && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
}
