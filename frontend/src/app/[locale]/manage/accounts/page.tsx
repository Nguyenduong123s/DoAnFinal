import AccountTable from "@/app/[locale]/manage/accounts/account-table";
import PageHeader from "@/app/[locale]/manage/page-header";
import CompactTable from "@/app/[locale]/manage/compact-table";
import { Suspense } from "react";
import envConfig, { Locale } from "@/config";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import AccountStatsClient from "@/app/[locale]/manage/accounts/account-stats-client";

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
    namespace: "ManageAccounts",
  });

  const url = envConfig.NEXT_PUBLIC_URL + `/${params.locale}/manage/accounts`;

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

export default function AccountsPage() {
  const cookieStore = cookies();
  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý tài khoản"
        description="Quản lý thông tin nhân viên và phân quyền truy cập hệ thống"
      />

      <AccountStatsClient />

      <CompactTable title="Danh sách tài khoản">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        >
          <AccountTable />
        </Suspense>
      </CompactTable>
    </div>
  );
}
