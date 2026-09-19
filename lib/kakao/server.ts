import type { KakaoSearchResponse } from "@/types/kakao";
import type { RestaurantSearchResponse } from "@/types/restaurant";
import { mapKakaoPlace } from "./mapper";

const KAKAO_API_BASE = "https://dapi.kakao.com/v2/local/search";

function getRestApiKey() {
  const key = process.env.KAKAO_REST_API_KEY;

  if (!key) {
    throw new Error("KAKAO_REST_API_KEY 환경변수가 설정되지 않았습니다.");
  }

  return key;
}

async function kakaoFetch(url: URL): Promise<RestaurantSearchResponse> {
  const response = await fetch(url, {
    headers: {
      Authorization: `KakaoAK ${getRestApiKey()}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Kakao API 오류 (${response.status}): ${body}`);
  }

  const data = (await response.json()) as KakaoSearchResponse;

  return {
    restaurants: data.documents.map(mapKakaoPlace),
    totalCount: data.meta.total_count,
    pageableCount: data.meta.pageable_count,
    isEnd: data.meta.is_end,
  };
}

export interface KeywordSearchOptions {
  query: string;
  x?: string;
  y?: string;
  radius?: string;
  page?: string;
  size?: string;
  categoryGroupCode?: "FD6" | "CE7" | "ALL";
}

export async function searchRestaurantsByKeyword({
  query,
  x,
  y,
  radius = "20000",
  page = "1",
  size = "15",
  categoryGroupCode = "FD6",
}: KeywordSearchOptions) {
  const url = new URL(`${KAKAO_API_BASE}/keyword.json`);
  url.searchParams.set("query", query);
  if (categoryGroupCode !== "ALL") {
    url.searchParams.set("category_group_code", categoryGroupCode);
  }
  url.searchParams.set("page", page);
  url.searchParams.set("size", size);

  if (x && y) {
    url.searchParams.set("x", x);
    url.searchParams.set("y", y);
    url.searchParams.set("radius", radius);
    url.searchParams.set("sort", "distance");
  }

  return kakaoFetch(url);
}

export interface NearbySearchOptions {
  x: string;
  y: string;
  radius?: string;
  page?: string;
  size?: string;
}

export async function searchNearbyRestaurants({
  x,
  y,
  radius = "3000",
  page = "1",
  size = "15",
}: NearbySearchOptions) {
  const url = new URL(`${KAKAO_API_BASE}/category.json`);
  url.searchParams.set("category_group_code", "FD6");
  url.searchParams.set("x", x);
  url.searchParams.set("y", y);
  url.searchParams.set("radius", radius);
  url.searchParams.set("sort", "distance");
  url.searchParams.set("page", page);
  url.searchParams.set("size", size);

  return kakaoFetch(url);
}

export async function findRestaurantById(
  id: string,
  placeName: string,
  x?: string,
  y?: string,
) {
  const result = await searchRestaurantsByKeyword({
    query: placeName,
    x,
    y,
    radius: x && y ? "3000" : undefined,
    size: "15",
    categoryGroupCode: "ALL",
  });

  return result.restaurants.find((restaurant) => restaurant.id === id) ?? null;
}
