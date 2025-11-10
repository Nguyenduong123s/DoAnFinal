import MenuOrder from "@/app/[locale]/guest/menu/menu-order";
import envConfig, { Locale } from "@/config";
import { baseOpenGraph } from "@/shared-metadata";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: { locale: Locale };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "GuestMenu",
  });

  const url = envConfig.NEXT_PUBLIC_URL + `/${params.locale}/guest/menu`;

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      ...baseOpenGraph,
      title: t("title"),
      description: t("description"),
      url,
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: false,
    },
  };
}

export default async function MenuPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Compact Header */}
      <div className="flex-shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-orange-200 dark:border-orange-800">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              Menu quán
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Chọn những món ăn yêu thích của bạn
            </p>

            {/* Decorative Elements */}
            <div className="flex justify-center space-x-2">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full height scrollable */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 h-full">
          <div className="max-w-md mx-auto h-full">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-t-2xl shadow-2xl border border-orange-200 dark:border-orange-800 h-full flex flex-col mt-4">
              <div className="flex-1 overflow-hidden p-4">
                <MenuOrder />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
