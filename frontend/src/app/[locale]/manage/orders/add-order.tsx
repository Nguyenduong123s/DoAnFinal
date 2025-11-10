"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, ShoppingCart, User, Utensils, Hash } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from "@/schemaValidations/guest.schema";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TablesDialog } from "@/app/[locale]/manage/orders/tables-dialog";
import { GetListGuestsResType } from "@/schemaValidations/account.schema";
import { Switch } from "@/components/ui/switch";
import GuestsDialog from "@/app/[locale]/manage/orders/guests-dialog";
import { CreateOrdersBodyType } from "@/schemaValidations/order.schema";
import Quantity from "@/app/[locale]/guest/menu/quantity";
import Image from "next/image";
import { cn, formatCurrency, handleErrorApi } from "@/lib/utils";
import { DishStatus } from "@/constants/type";
import { useDishListQuery } from "@/queries/useDish";
import { useCreateOrderMutation } from "@/queries/useOrder";
import { useCreateGuestMutation } from "@/queries/useAccount";
import { toast } from "@/components/ui/use-toast";

export default function AddOrder() {
  const [open, setOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<
    GetListGuestsResType["data"][0] | null
  >(null);
  const [isNewGuest, setIsNewGuest] = useState(true);
  const [orders, setOrders] = useState<CreateOrdersBodyType["orders"]>([]);
  const { data } = useDishListQuery();
  const dishes = useMemo(() => data?.payload.data ?? [], [data]);

  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id);
      if (!order) return result;
      return result + order.quantity * dish.price;
    }, 0);
  }, [dishes, orders]);
  const createOrderMutation = useCreateOrderMutation();
  const createGuestMutation = useCreateGuestMutation();

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: "",
      tableNumber: 0,
    },
  });
  const name = form.watch("name");
  const tableNumber = form.watch("tableNumber");

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
      let guestId = selectedGuest?.id;
      if (isNewGuest) {
        const guestRes = await createGuestMutation.mutateAsync({
          name,
          tableNumber,
        });
        guestId = guestRes.payload.data.id;
      }
      if (!guestId) {
        toast({
          description: "Hãy chọn một khách hàng",
        });
        return;
      }
      await createOrderMutation.mutateAsync({
        guestId,
        orders,
      });
      reset();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  const reset = () => {
    form.reset();
    setSelectedGuest(null);
    setIsNewGuest(true);
    setOrders([]);
    setOpen(false);
  };

  return (
    <Dialog
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
        setOpen(value);
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          <span className="font-medium">Tạo đơn hàng</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">Tạo đơn hàng mới</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Selection Toggle */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <Label htmlFor="isNewGuest" className="text-base font-medium">
                  Khách hàng mới
                </Label>
              </div>
              <Switch
                id="isNewGuest"
                checked={isNewGuest}
                onCheckedChange={setIsNewGuest}
              />
            </div>
          </div>

          {/* New Customer Form */}
          {isNewGuest && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-emerald-600" />
                Thông tin khách hàng
              </h3>
              <Form {...form}>
                <form noValidate className="space-y-4" id="add-order-form">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Tên khách hàng <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            className="pl-10 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Nhập tên khách hàng"
                            {...field}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tableNumber"
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="tableNumber"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Số bàn <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border">
                            <Hash className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-lg">
                              {field.value || "Chưa chọn"}
                            </span>
                          </div>
                          <TablesDialog
                            onChoose={(table) => {
                              field.onChange(table.number);
                            }}
                          />
                        </div>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          )}

          {/* Existing Customer Selection */}
          {!isNewGuest && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-emerald-600" />
                Chọn khách hàng
              </h3>
              {selectedGuest && (
                <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <p className="font-medium">
                    {selectedGuest.name} (#{selectedGuest.id})
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bàn: {selectedGuest.tableNumber}
                  </p>
                </div>
              )}
              <GuestsDialog
                onChoose={(guest) => {
                  setSelectedGuest(guest);
                }}
              />
            </div>
          )}

          {/* Menu Selection */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Utensils className="w-5 h-5 mr-2 text-emerald-600" />
              Chọn món ăn
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-auto">
              {dishes
                .filter((dish) => dish.status !== DishStatus.Hidden)
                .map((dish) => {
                  const order = orders.find(
                    (order) => order.dishId === dish.id
                  );
                  return (
                    <div
                      key={dish.id}
                      className={cn(
                        "flex gap-4 p-4 border rounded-lg transition-all duration-200",
                        order
                          ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-950 shadow-md"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      )}
                    >
                      <div className="flex-shrink-0">
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          height={80}
                          width={80}
                          className="object-cover w-20 h-20 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <h3 className="text-base font-semibold">{dish.name}</h3>
                        <p className="text-emerald-600 font-bold">
                          {formatCurrency(dish.price)}
                        </p>
                        <div className="flex items-center justify-between">
                          <Quantity
                            onChange={(value) =>
                              handleQuantityChange(dish.id, value)
                            }
                            value={order?.quantity ?? 0}
                          />
                          {order && (
                            <span className="text-sm text-emerald-600 font-medium">
                              {formatCurrency(order.quantity * dish.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Order Summary */}
          {orders.length > 0 && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-emerald-800 dark:text-emerald-200">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Tóm tắt đơn hàng
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-base">
                  <span>Tổng số món:</span>
                  <span className="font-medium">{orders.length}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Tổng số lượng:</span>
                  <span className="font-medium">
                    {orders.reduce((sum, order) => sum + order.quantity, 0)}
                  </span>
                </div>
                <div className="border-t border-emerald-200 dark:border-emerald-800 pt-2">
                  <div className="flex justify-between text-lg font-bold text-emerald-800 dark:text-emerald-200">
                    <span>Tổng tiền:</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={reset}>
            Hủy
          </Button>
          <Button
            onClick={handleOrder}
            disabled={createOrderMutation.isPending || orders.length === 0}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            {createOrderMutation.isPending ? "Đang tạo..." : "Tạo đơn hàng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
