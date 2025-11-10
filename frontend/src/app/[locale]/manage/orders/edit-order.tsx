"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UpdateOrderBody,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getVietnameseOrderStatus, handleErrorApi } from "@/lib/utils";
import { OrderStatus, OrderStatusValues } from "@/constants/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DishesDialog } from "@/app/[locale]/manage/orders/dishes-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { DishListResType } from "@/schemaValidations/dish.schema";
import {
  useGetOrderDetailQuery,
  useUpdateOrderMutation,
} from "@/queries/useOrder";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Hash, Clock, Save, X } from "lucide-react";

export default function EditOrder({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const [selectedDish, setSelectedDish] = useState<
    DishListResType["data"][0] | null
  >(null);
  const updateOrderMutation = useUpdateOrderMutation();
  const { data } = useGetOrderDetailQuery({
    id: id as number,
    enabled: Boolean(id),
  });

  const form = useForm<UpdateOrderBodyType>({
    resolver: zodResolver(UpdateOrderBody),
    defaultValues: {
      status: OrderStatus.Pending,
      dishId: 0,
      quantity: 1,
    },
  });

  useEffect(() => {
    if (data) {
      const {
        status,
        dishSnapshot: { dishId },
        quantity,
      } = data.payload.data;
      form.reset({
        status,
        dishId: dishId ?? 0,
        quantity,
      });
      setSelectedDish(data.payload.data.dishSnapshot);
    }
  }, [data, form]);

  const onSubmit = async (values: UpdateOrderBodyType) => {
    if (updateOrderMutation.isPending) return;
    try {
      let body: UpdateOrderBodyType & { orderId: number } = {
        orderId: id as number,
        ...values,
      };
      const result = await updateOrderMutation.mutateAsync(body);
      toast({
        description: result.payload.message,
      });
      reset();
      onSubmitSuccess && onSubmitSuccess();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  const reset = () => {
    setId(undefined);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.Pending:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case OrderStatus.Processing:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case OrderStatus.Delivered:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case OrderStatus.Paid:
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      case OrderStatus.Rejected:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-auto bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 border-0 shadow-2xl">
        <DialogHeader className="relative pb-6">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
          <div className="relative">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent flex items-center gap-3">
              <Package className="h-7 w-7 text-orange-500" />
              Cập nhật đơn hàng
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Chỉnh sửa thông tin đơn hàng của bạn
            </p>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <Form {...form}>
          <form
            noValidate
            className="space-y-8"
            id="edit-order-form"
            onSubmit={form.handleSubmit(onSubmit, console.log)}
          >
            <div className="space-y-8">
              {/* Dish Selection */}
              <FormField
                control={form.control}
                name="dishId"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-lg font-semibold flex items-center gap-2">
                      <Package className="h-5 w-5 text-orange-500" />
                      Món ăn
                    </FormLabel>
                    <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-16 h-16 rounded-xl border-2 border-orange-200 dark:border-orange-800 shadow-md">
                            <AvatarImage
                              src={selectedDish?.image}
                              className="object-cover"
                            />
                            <AvatarFallback className="rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900 dark:to-pink-900 text-orange-700 dark:text-orange-300 font-medium">
                              {selectedDish?.name?.slice(0, 2)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                              {selectedDish?.name || "Chưa chọn món"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {selectedDish?.description ||
                                "Vui lòng chọn món ăn"}
                            </p>
                            {selectedDish?.price && (
                              <Badge variant="secondary" className="mt-2">
                                {selectedDish.price.toLocaleString("vi-VN")} ₫
                              </Badge>
                            )}
                          </div>
                        </div>
                        <DishesDialog
                          onChoose={(dish) => {
                            field.onChange(dish.id);
                            setSelectedDish(dish);
                          }}
                        />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Quantity Input */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-lg font-semibold flex items-center gap-2">
                      <Hash className="h-5 w-5 text-blue-500" />
                      Số lượng
                    </FormLabel>
                    <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Input
                            id="quantity"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="w-24 h-12 text-center text-lg font-semibold border-2 border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                            {...field}
                            value={field.value}
                            onChange={(e) => {
                              let value = e.target.value;
                              const numberValue = Number(value);
                              if (isNaN(numberValue)) {
                                return;
                              }
                              field.onChange(numberValue);
                            }}
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Nhập số lượng món ăn</p>
                          <p className="text-xs">Tối thiểu: 1</p>
                        </div>
                      </div>
                      <FormMessage className="mt-2" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Status Selection */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-500" />
                      Trạng thái
                    </FormLabel>
                    <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <Badge
                            className={`${getStatusColor(
                              field.value
                            )} border-0`}
                          >
                            {getVietnameseOrderStatus(field.value)}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {field.value === OrderStatus.Paid
                              ? "Đơn hàng đã thanh toán - không thể thay đổi trạng thái"
                              : "Trạng thái hiện tại của đơn hàng"}
                          </p>
                        </div>
                        {field.value === OrderStatus.Paid ? (
                          <div className="w-[240px] h-12 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-0">
                              {getVietnameseOrderStatus(field.value)}
                            </Badge>
                          </div>
                        ) : (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[240px] h-12 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 rounded-lg">
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-gray-200 dark:border-slate-600 rounded-xl shadow-xl">
                              {OrderStatusValues.map((status) => (
                                <SelectItem
                                  key={status}
                                  value={status}
                                  className="hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer rounded-lg mx-1"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-3 h-3 rounded-full ${
                                        getStatusColor(status).split(" ")[0]
                                      }`}
                                    ></div>
                                    {getVietnameseOrderStatus(status)}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      <FormMessage className="mt-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <Separator className="my-6" />

        <DialogFooter className="gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={reset}
            className="px-6 py-2 h-12 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200"
          >
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
          <Button
            type="submit"
            form="edit-order-form"
            disabled={updateOrderMutation.isPending}
            className="px-6 py-2 h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            {updateOrderMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang lưu...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Cập nhật
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
