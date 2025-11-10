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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  getTableLink,
  getVietnameseTableStatus,
  handleErrorApi,
} from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UpdateTableBody,
  UpdateTableBodyType,
} from "@/schemaValidations/table.schema";
import { TableStatus, TableStatusValues } from "@/constants/type";
import { Switch } from "@/components/ui/switch";
import { Link } from "@/navigation";
import { useEffect } from "react";
import { useGetTableQuery, useUpdateTableMutation } from "@/queries/useTable";
import { toast } from "@/components/ui/use-toast";
import QRCodeTable from "@/components/qrcode-table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Hash,
  Users,
  Activity,
  RefreshCw,
  QrCode,
  ExternalLink,
  Save,
  Utensils,
} from "lucide-react";

export default function EditTable({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const updateTableMutation = useUpdateTableMutation();

  const form = useForm<UpdateTableBodyType>({
    resolver: zodResolver(UpdateTableBody),
    defaultValues: {
      capacity: 2,
      status: TableStatus.Hidden,
      changeToken: false,
    },
  });
  const { data } = useGetTableQuery({ enabled: Boolean(id), id: id as number });

  useEffect(() => {
    if (data) {
      const { capacity, status } = data.payload.data;
      form.reset({
        capacity,
        status,
        changeToken: form.getValues("changeToken"),
      });
    }
  }, [data, form]);
  const onSubmit = async (values: UpdateTableBodyType) => {
    if (updateTableMutation.isPending) return;
    try {
      let body: UpdateTableBodyType & { id: number } = {
        id: id as number,
        ...values,
      };
      const result = await updateTableMutation.mutateAsync(body);
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

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 border-0 shadow-2xl"
        onCloseAutoFocus={() => {
          form.reset();
          setId(undefined);
        }}
      >
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Utensils className="h-5 w-5 text-white" />
            </div>
            Cập nhật bàn ăn
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit, console.log)}
            id="edit-table-form"
          >
            {/* Basic Info - Combined Card */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-4 space-y-4">
                {/* Table Number */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Số hiệu bàn
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="number"
                        className="w-20 text-center font-bold bg-white dark:bg-gray-800"
                        value={data?.payload.data.number ?? 0}
                        readOnly
                      />
                      <Badge variant="secondary" className="text-xs">
                        Không đổi
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Capacity & Status - Side by side */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Sức chứa
                            </Label>
                            <Input
                              className="w-full text-center font-semibold mt-1"
                              {...field}
                              type="number"
                              min="1"
                              max="20"
                            />
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Trạng thái
                            </Label>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="mt-1 h-9">
                                  <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TableStatusValues.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`w-2 h-2 rounded-full ${
                                          status === "Available"
                                            ? "bg-green-500"
                                            : status === "Hidden"
                                            ? "bg-gray-500"
                                            : status === "Reserved"
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                        }`}
                                      />
                                      {getVietnameseTableStatus(status)}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Change Token */}
                <FormField
                  control={form.control}
                  name="changeToken"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <RefreshCw className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Đổi QR Code
                          </Label>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-purple-600"
                            />
                            <span className="text-xs text-gray-500">
                              {field.value ? "Tạo mới" : "Giữ nguyên"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* QR Code & URL - Combined Card */}
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* QR Code */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-2">
                      <QrCode className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        QR Code hiện tại
                      </Label>
                    </div>
                    {data && (
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
                        <QRCodeTable
                          token={data.payload.data.token}
                          tableNumber={data.payload.data.number}
                        />
                      </div>
                    )}
                  </div>

                  {/* URL */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <ExternalLink className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        URL gọi món
                      </Label>
                    </div>
                    {data && (
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border flex-1">
                        <Link
                          href={getTableLink({
                            token: data.payload.data.token,
                            tableNumber: data.payload.data.number,
                          })}
                          target="_blank"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 break-all text-xs font-mono transition-colors"
                        >
                          {getTableLink({
                            token: data.payload.data.token,
                            tableNumber: data.payload.data.number,
                          })}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>

        <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="submit"
            form="edit-table-form"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={updateTableMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {updateTableMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
