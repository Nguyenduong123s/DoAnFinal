import envConfig from "@/config";

export async function GET() {
  try {
    const response = await fetch(
      `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/test/test-websocket`
    );
    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Failed to test websocket" },
      { status: 500 }
    );
  }
}
