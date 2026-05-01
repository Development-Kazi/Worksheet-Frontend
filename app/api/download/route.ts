import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

  if (!rawUrl) {
    return NextResponse.json(
      { success: false, message: "Missing file url" },
      { status: 400 },
    );
  }

  try {
    const decoded = decodeURIComponent(rawUrl).replace(/\\/g, "/").trim();
    const repaired = decoded
      .replace(/^(https?:\/\/[^/]+)public\//i, "$1/public/")
      .replace(/^(https?:\/\/[^/]+)\/public\//i, "$1/");
    const cleanPath = repaired;
    const normalizedPath = cleanPath.startsWith("public/")
      ? cleanPath.slice("public/".length)
      : cleanPath;

    const sourceUrl = /^https?:\/\//i.test(normalizedPath)
      ? normalizedPath
      : `${apiBaseUrl.replace(/\/$/, "")}/${normalizedPath.replace(/^\//, "")}`;

    const sourceResponse = await fetch(sourceUrl, {
      cache: "no-store",
      redirect: "follow",
    });

    if (!sourceResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `Unable to fetch file (${sourceResponse.status} ${sourceResponse.statusText})`,
          sourceUrl,
        },
        { status: sourceResponse.status },
      );
    }

    const fileBuffer = await sourceResponse.arrayBuffer();
    const urlPath = new URL(sourceUrl).pathname;
    const fileName = decodeURIComponent(urlPath.split("/").pop() || "worksheet.pdf");

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "content-type": sourceResponse.headers.get("content-type") ?? "application/pdf",
        "content-disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: `File download failed: ${message}` },
      { status: 500 },
    );
  }
}
