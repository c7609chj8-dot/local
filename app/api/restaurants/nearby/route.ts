import { NextRequest, NextResponse } from "next/server";
import { searchNearbyRestaurants } from "@/lib/kakao/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const x = searchParams.get("x");
  const y = searchParams.get("y");

  if (
    !x ||
    !y ||
    !Number.isFinite(Number(x)) ||
    !Number.isFinite(Number(y))
  ) {
    return NextResponse.json(
      { message: "위치 좌표가 필요합니다." },
      { status: 400 },
    );
  }

  try {
    const data = await searchNearbyRestaurants({
      x,
      y,
      radius: searchParams.get("radius") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      size: searchParams.get("size") ?? undefined,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "주변 맛집검색 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
