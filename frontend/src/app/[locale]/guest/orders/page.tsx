import OrdersCart from "@/app/[locale]/guest/orders/orders-cart";

export default function OrdersPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Compact Header */}
      <div className="flex-shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-blue-200 dark:border-blue-800">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7M9 3V4H15V3H9M7 6V19H17V6H7Z" />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              Đơn hàng của bạn
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              Theo dõi trạng thái đơn hàng và thanh toán
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Takes remaining space */}
      <div className="flex-1 container mx-auto px-4 py-4 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-200 dark:border-blue-800 h-full flex flex-col overflow-hidden">
            <div className="flex-1 p-4 overflow-hidden">
              <OrdersCart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
