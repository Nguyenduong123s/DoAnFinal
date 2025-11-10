import envConfig from "@/config";

export async function GET(
  request: Request,
  { params }: { params: { tableNumber: string } }
) {
  try {
    const response = await fetch(
      `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/test/debug-table/${params.tableNumber}`
    );
    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: `Failed to debug table ${params.tableNumber}` },
      { status: 500 }
    );
  }
}
