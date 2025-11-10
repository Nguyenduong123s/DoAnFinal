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
import {
  PlusCircle,
  Upload,
  ChefHat,
  DollarSign,
  FileText,
  Tag,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getVietnameseDishStatus, handleErrorApi } from "@/lib/utils";
import {
  CreateDishBody,
  CreateDishBodyType,
} from "@/schemaValidations/dish.schema";
import { DishStatus, DishStatusValues } from "@/constants/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAddDishMutation } from "@/queries/useDish";
import { useUploadMediaMutation } from "@/queries/useMedia";
import { toast } from "@/components/ui/use-toast";
import revalidateApiRequest from "@/apiRequests/revalidate";

const getStatusIndicator = (status: string) => {
  switch (status) {
    case "Available":
      return <div className="w-2 h-2 bg-green-500 rounded-full" />;
    case "Unavailable":
      return <div className="w-2 h-2 bg-red-500 rounded-full" />;
    case "Hidden":
      return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    default:
      return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
  }
};

export default function AddDish() {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const addDishMutation = useAddDishMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<CreateDishBodyType>({
    resolver: zodResolver(CreateDishBody),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: undefined,
      status: DishStatus.Unavailable,
    },
  });
  const image = form.watch("image");
  const name = form.watch("name");
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return image;
  }, [file, image]);
  const reset = () => {
    form.reset();
    setFile(null);
  };
  const onSubmit = async (values: CreateDishBodyType) => {
    if (addDishMutation.isPending) return;
    try {
      let body = values;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadImageResult = await uploadMediaMutation.mutateAsync(
          formData
        );
        const imageUrl = uploadImageResult.payload.data;
        body = {
          ...values,
          image: imageUrl,
        };
      }
      const result = await addDishMutation.mutateAsync(body);
      await revalidateApiRequest("dishes");
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
        <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg transition-all duration-200 hover:shadow-xl">
          <PlusCircle className="h-4 w-4 mr-2" />
          Thêm món ăn
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center space-x-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span>Thêm món ăn mới</span>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="space-y-6"
            id="add-dish-form"
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e);
            })}
            onReset={reset}
          >
            {/* Image Upload Section */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      <Label className="font-semibold text-gray-700 dark:text-gray-200">
                        Ảnh món ăn
                      </Label>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20 rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-600">
                        <AvatarImage
                          src={previewAvatarFromFile}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-lg bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900">
                          <ChefHat className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFile(file);
                            field.onChange(
                              "http://localhost:3000/" + file.name
                            );
                          }
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => imageInputRef.current?.click()}
                        className="border-dashed border-2 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Tải ảnh lên
                      </Button>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <ChefHat className="w-5 h-5 text-orange-600" />
                      <Label
                        htmlFor="name"
                        className="font-semibold text-gray-700 dark:text-gray-200"
                      >
                        Tên món ăn
                      </Label>
                    </div>
                    <Input
                      id="name"
                      placeholder="Nhập tên món ăn..."
                      className="w-full border-gray-200 dark:border-gray-600 focus:border-orange-500"
                      {...field}
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Price Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <Label
                        htmlFor="price"
                        className="font-semibold text-gray-700 dark:text-gray-200"
                      >
                        Giá (VNĐ)
                      </Label>
                    </div>
                    <Input
                      id="price"
                      placeholder="Nhập giá món ăn..."
                      className="w-full border-gray-200 dark:border-gray-600 focus:border-green-500"
                      {...field}
                      type="number"
                      min="0"
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <Label
                        htmlFor="description"
                        className="font-semibold text-gray-700 dark:text-gray-200"
                      >
                        Mô tả món ăn
                      </Label>
                    </div>
                    <Textarea
                      id="description"
                      placeholder="Mô tả chi tiết về món ăn..."
                      className="w-full min-h-[100px] border-gray-200 dark:border-gray-600 focus:border-blue-500 resize-none"
                      {...field}
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Status Field */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-5 h-5 text-purple-600" />
                      <Label
                        htmlFor="status"
                        className="font-semibold text-gray-700 dark:text-gray-200"
                      >
                        Trạng thái
                      </Label>
                    </div>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-200 dark:border-gray-600 focus:border-purple-500">
                          <SelectValue placeholder="Chọn trạng thái món ăn" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DishStatusValues.map((status) => (
                          <SelectItem key={status} value={status}>
                            <div className="flex items-center space-x-2">
                              {getStatusIndicator(status)}
                              <span>{getVietnameseDishStatus(status)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="border-t pt-4 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-300"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="add-dish-form"
            disabled={
              addDishMutation.isPending || uploadMediaMutation.isPending
            }
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
          >
            {(addDishMutation.isPending || uploadMediaMutation.isPending) && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            {addDishMutation.isPending || uploadMediaMutation.isPending
              ? "Đang thêm..."
              : "Thêm món"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
