import DashboardMain from "@/app/[locale]/manage/dashboard/dashboard-main";
import PageHeader from "@/app/[locale]/manage/page-header";
import envConfig, { Locale } from "@/config";
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
    namespace: "Dashboard",
  });

  const url = envConfig.NEXT_PUBLIC_URL + `/${params.locale}/manage/dashboard`;

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

export default async function Dashboard() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        description="Phân tích các chỉ số kinh doanh và hiệu suất nhà hàng"
      />
      <DashboardMain />
    </div>
  );
}
