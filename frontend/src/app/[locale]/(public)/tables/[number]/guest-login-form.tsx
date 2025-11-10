"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from "@/schemaValidations/guest.schema";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect } from "react";
import { useGuestLoginMutation } from "@/queries/useGuest";
import { useAppStore } from "@/components/app-provider";
import { generateSocketInstace, handleErrorApi } from "@/lib/utils";
import { useRouter } from "@/navigation";

export default function GuestLoginForm() {
  const setSocket = useAppStore((state) => state.setSocket);
  const setRole = useAppStore((state) => state.setRole);
  const searchParams = useSearchParams();
  const params = useParams();
  const tableNumber = Number(params.number);
  const token = searchParams.get("token");
  const router = useRouter();
  const loginMutation = useGuestLoginMutation();
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: "",
      token: token ?? "",
      tableNumber,
    },
  });

  useEffect(() => {
    console.log("🔍 Guest Login Debug:", {
      token,
      tableNumber,
      hasToken: !!token,
      searchParamsAll: Object.fromEntries(searchParams.entries()),
    });

    if (!token) {
      console.log("❌ No token found, redirecting to home");
      router.push("/");
    }
  }, [token, router, tableNumber, searchParams]);

  async function onSubmit(values: GuestLoginBodyType) {
    if (loginMutation.isPending) return;
    console.log("🚀 Guest Login Attempt:", values);
    try {
      const result = await loginMutation.mutateAsync(values);
      console.log("✅ Guest Login Success:", result);
      setRole(result.payload.data.guest.role);
      setSocket(generateSocketInstace(result.payload.data.accessToken));
      console.log("🔄 Redirecting to /guest/menu");
      router.push("/guest/menu");
    } catch (error: any) {
      console.log("❌ Guest Login Error:", error);

      // Check if error is related to table status
      const errorMessage =
        error?.payload?.message || error?.message || "Có lỗi xảy ra";

      if (
        errorMessage.includes("bị ẩn") ||
        errorMessage.includes("đã được đặt") ||
        errorMessage.includes("đang có khách")
      ) {
        // Show specific error for table status issues
        form.setError("root", {
          type: "manual",
          message: errorMessage,
        });
      } else {
        handleErrorApi({
          error,
          setError: form.setError,
        });
      }
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Đăng nhập gọi món
          </CardTitle>
          <p className="text-orange-100 text-sm mt-2">
            Vui lòng nhập tên để bắt đầu đặt món
          </p>
        </CardHeader>

        <CardContent className="p-8">
          <Form {...form}>
            <form
              className="space-y-6"
              noValidate
              onSubmit={form.handleSubmit(onSubmit, console.log)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label
                      htmlFor="name"
                      className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2"
                    >
                      <svg
                        className="w-5 h-5 text-orange-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      <span>Tên khách hàng</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Nhập tên của bạn..."
                      className="mt-2 h-12 text-base border-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                      required
                      {...field}
                    />
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang đăng nhập...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                    </svg>
                    <span>Bắt đầu đặt món</span>
                  </div>
                )}
              </Button>

              {/* Display root errors */}
              {form.formState.errors.root && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <svg
                      className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12,2L13.09,8.26L22,9L17,14L18.18,22L12,19.27L5.82,22L7,14L2,9L10.91,8.26L12,2Z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        Không thể đăng nhập
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        {form.formState.errors.root.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                  </svg>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p className="font-medium text-orange-700 dark:text-orange-300 mb-1">
                      Hướng dẫn sử dụng:
                    </p>
                    <ul className="space-y-1 text-xs">
                      <li>• Nhập tên để nhận diện đơn hàng</li>
                      <li>• Chọn món ăn từ menu điện tử</li>
                      <li>• Thanh toán trực tiếp tại quầy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg
              className="w-4 h-4 text-green-600 dark:text-green-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
            </svg>
          </div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Nhanh chóng
          </p>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg
              className="w-4 h-4 text-blue-600 dark:text-blue-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.2C16,16.8 15.4,17.3 14.8,17.3H9.2C8.6,17.3 8,16.8 8,16.2V12.7C8,12.1 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z" />
            </svg>
          </div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
            An toàn
          </p>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg
              className="w-4 h-4 text-purple-600 dark:text-purple-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1C14.2,1.6 13.2,2 12,2C10.8,2 9.8,1.6 9,1L3,7V9H21M12,8C12.6,8 13,8.4 13,9V11H11V9C11,8.4 11.4,8 12,8Z" />
            </svg>
          </div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Tiện lợi
          </p>
        </div>
      </div>
    </div>
  );
}
