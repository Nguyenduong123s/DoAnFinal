import TableTable from "@/app/[locale]/manage/tables/table-table";
import TableStats from "@/app/[locale]/manage/tables/table-stats";
import PageHeader from "@/app/[locale]/manage/page-header";
import CompactTable from "@/app/[locale]/manage/compact-table";
import { Suspense } from "react";
import { Metadata } from "next";
import envConfig, { Locale } from "@/config";
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
    namespace: "Tables",
  });

  const url = envConfig.NEXT_PUBLIC_URL + `/${params.locale}/manage/tables`;

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

export default function TablesPage() {
  return (
    <div className="space-y-3">
      <PageHeader
        title="Quản lý bàn ăn"
        description="Quản lý thông tin bàn ăn, QR code và trạng thái bàn một cách dễ dàng"
      />

      <TableStats />

      <CompactTable title="Danh sách bàn ăn">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        >
          <TableTable />
        </Suspense>
      </CompactTable>
    </div>
  );
}
