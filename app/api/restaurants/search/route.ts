import { NextRequest, NextResponse } from "next/server";
import { searchRestaurantsByKeyword } from "@/lib/kakao/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json(
      { message: "검색어를 입력해 주세요." },
      { status: 400 },
    );
  }

  const rawCategoryGroupCode = searchParams.get("categoryGroupCode");
  const categoryGroupCode =
    rawCategoryGroupCode === "CE7" || rawCategoryGroupCode === "ALL"
      ? rawCategoryGroupCode
      : "FD6";

  try {
    const data = await searchRestaurantsByKeyword({
      query,
      x: searchParams.get("x") ?? undefined,
      y: searchParams.get("y") ?? undefined,
      radius: searchParams.get("radius") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      size: searchParams.get("size") ?? undefined,
      categoryGroupCode,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "카카오 맛집검색 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
