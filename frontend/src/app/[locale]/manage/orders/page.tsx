import OrderTable from "@/app/[locale]/manage/orders/order-table";
import PageHeader from "@/app/[locale]/manage/page-header";
import CompactTable from "@/app/[locale]/manage/compact-table";
import envConfig, { Locale } from "@/config";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

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
    namespace: "Orders",
  });

  const url = envConfig.NEXT_PUBLIC_URL + `/${params.locale}/manage/orders`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: url,
    },
    robots: {
      index: false,
    },
  };
}

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý đơn hàng"
        description="Theo dõi và quản lý tất cả đơn hàng từ đặt bàn đến thanh toán"
      />

      <CompactTable title="Danh sách đơn hàng">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        >
          <OrderTable />
        </Suspense>
      </CompactTable>
    </div>
  );
}
