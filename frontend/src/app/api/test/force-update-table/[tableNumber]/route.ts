import envConfig from "@/config";

export async function POST(
  request: Request,
  { params }: { params: { tableNumber: string } }
) {
  try {
    const response = await fetch(
      `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/test/force-update-table/${params.tableNumber}`,
      { method: "POST" }
    );
    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: `Failed to force update table ${params.tableNumber}` },
      { status: 500 }
    );
  }
}
