import { NextRequest, NextResponse } from "next/server";

const DEFAULT_BASE = "http://localhost:5165";

function getBaseUrl() {
  return (process.env.BFF_BASE_URL || DEFAULT_BASE).replace(/\/+$/, "");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const baseUrl = getBaseUrl();
  const { path } = await params;
  const joined = path.join("/");
  const url = `${baseUrl}/${joined}${req.nextUrl.search}`;

  const upstream = await fetch(url, {
    method: "GET",
    headers: {
      accept: req.headers.get("accept") ?? "application/json",
    },
    // RTK Query будет управлять кэшем на клиенте; прокси не кешируем.
    cache: "no-store",
  });

  const contentType = upstream.headers.get("content-type") ?? "application/json";
  const body = await upstream.text();

  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      "content-type": contentType,
    },
  });
}

