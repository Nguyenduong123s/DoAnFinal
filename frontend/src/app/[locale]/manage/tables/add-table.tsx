"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Users, Hash, Settings } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { getVietnameseTableStatus, handleErrorApi } from "@/lib/utils";
import {
  CreateTableBody,
  CreateTableBodyType,
} from "@/schemaValidations/table.schema";
import { TableStatus, TableStatusValues } from "@/constants/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddTableMutation } from "@/queries/useTable";
import { toast } from "@/components/ui/use-toast";

export default function AddTable() {
  const [open, setOpen] = useState(false);
  const addTableMutation = useAddTableMutation();
  const form = useForm<CreateTableBodyType>({
    resolver: zodResolver(CreateTableBody),
    defaultValues: {
      number: 0,
      capacity: 2,
      status: TableStatus.Hidden,
    },
  });

  const reset = () => {
    form.reset();
  };

  const onSubmit = async (values: CreateTableBodyType) => {
    if (addTableMutation.isPending) return;
    try {
      const result = await addTableMutation.mutateAsync(values);
      toast({
        description: result.payload.message,
      });
      reset();
      setOpen(false);
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
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
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          <span className="font-semibold">Thêm bàn</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-screen overflow-auto">
        <DialogHeader className="space-y-4 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Thêm bàn mới
              </DialogTitle>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Tạo bàn ăn mới cho nhà hàng
              </p>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e);
            })}
            onReset={reset}
            className="space-y-6"
            id="add-table-form"
          >
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <Label
                    htmlFor="number"
                    className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    <Hash className="w-4 h-4" />
                    <span>Số hiệu bàn</span>
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="number"
                      type="number"
                      placeholder="Nhập số bàn (VD: 1, 2, 3...)"
                      className="w-full h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                      {...field}
                    />
                    <FormMessage className="text-red-500 text-sm" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <Label
                    htmlFor="capacity"
                    className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    <Users className="w-4 h-4" />
                    <span>Sức chứa</span>
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="Số lượng khách tối đa (VD: 2, 4, 6...)"
                      className="w-full h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                      {...field}
                    />
                    <FormMessage className="text-red-500 text-sm" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <Label
                    htmlFor="status"
                    className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Trạng thái ban đầu</span>
                  </Label>
                  <div className="space-y-2">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400">
                          <SelectValue placeholder="Chọn trạng thái bàn" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TableStatusValues.map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  status === "Available"
                                    ? "bg-green-500"
                                    : status === "Hidden"
                                    ? "bg-gray-500"
                                    : "bg-orange-500"
                                }`}
                              ></div>
                              <span>{getVietnameseTableStatus(status)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-sm" />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto border-gray-300 hover:bg-gray-50"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="add-table-form"
            disabled={addTableMutation.isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {addTableMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Đang tạo...
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 mr-2" />
                Tạo bàn
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
