import DishTable from "@/app/[locale]/manage/dishes/dish-table";
import PageHeader from "@/app/[locale]/manage/page-header";
import CompactTable from "@/app/[locale]/manage/compact-table";
import { Suspense } from "react";
import envConfig, { Locale } from "@/config";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import DishStatsClient from "@/app/[locale]/manage/dishes/dish-stats-client";

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
    namespace: "Dishes",
  });

  const url = envConfig.NEXT_PUBLIC_URL + `/${params.locale}/manage/dishes`;

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

export default function DishesPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý món ăn"
        description="Quản lý thực đơn, giá cả và trạng thái món ăn một cách dễ dàng"
      />

      <DishStatsClient />

      <CompactTable title="Danh sách món ăn">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        >
          <DishTable />
        </Suspense>
      </CompactTable>
    </div>
  );
}
