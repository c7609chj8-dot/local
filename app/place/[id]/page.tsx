import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findRestaurantById } from "@/lib/kakao/server";
import { formatDistance } from "@/lib/utils";
import PlaceMap from "@/components/map/PlaceMap";
import PlaceActions from "@/components/PlaceActions";

interface PlacePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    name?: string | string[];
    x?: string | string[];
    y?: string | string[];
    distance?: string | string[];
  }>;
}

async function getPlace(props: PlacePageProps) {
  const { id } = await props.params;
  const search = await props.searchParams;
  const name = Array.isArray(search.name) ? search.name[0] : search.name;
  const x = Array.isArray(search.x) ? search.x[0] : search.x;
  const y = Array.isArray(search.y) ? search.y[0] : search.y;

  if (!name) return null;
  return findRestaurantById(id, name, x, y);
}

export async function generateMetadata(props: PlacePageProps): Promise<Metadata> {
  const search = await props.searchParams;
  const name = Array.isArray(search.name) ? search.name[0] : search.name;

  return {
    title: name || "맛집 상세",
    description: name ? `${name} 위치와 상세정보를 확인하세요.` : "맛집 상세정보",
  };
}

export default async function PlacePage(props: PlacePageProps) {
  const place = await getPlace(props);

  if (!place) {
    notFound();
  }

  const detailSearch = await props.searchParams;
  const rawDistance = Array.isArray(detailSearch.distance)
    ? detailSearch.distance[0]
    : detailSearch.distance;
  const distance = formatDistance(rawDistance);
  const address = place.roadAddressName || place.addressName;
  const kakaoDirections = `https://map.kakao.com/link/to/${encodeURIComponent(place.placeName)},${place.y},${place.x}`;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          ← 맛집검색으로 돌아가기
        </Link>

        <section className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-amber-700">
                  {place.categoryGroupName || "음식점"}
                </p>
                <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
                  {place.placeName}
                </h1>
                <p className="mt-2 text-sm text-slate-500">{place.categoryName}</p>
              </div>

              {distance && (
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                  {distance}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-5 p-6 sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                주소
              </p>
              <p className="mt-1 text-slate-800">{address}</p>
              {place.roadAddressName && place.addressName && (
                <p className="mt-1 text-sm text-slate-500">지번 {place.addressName}</p>
              )}
              <PlaceActions address={address} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                전화번호
              </p>
              <p className="mt-1 text-slate-800">{place.phone || "등록된 전화번호 없음"}</p>
            </div>

            <PlaceMap place={place} />

            <div className="grid gap-3 sm:grid-cols-3">
              {place.phone ? (
                <a
                  href={`tel:${place.phone.replace(/[^0-9+]/g, "")}`}
                  className="rounded-xl bg-slate-900 px-4 py-3 text-center font-semibold text-white hover:bg-slate-700"
                >
                  전화하기
                </a>
              ) : (
                <span className="rounded-xl bg-slate-100 px-4 py-3 text-center font-semibold text-slate-400">
                  전화번호 없음
                </span>
              )}

              <a
                href={kakaoDirections}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-300 px-4 py-3 text-center font-semibold text-slate-800 hover:bg-slate-50"
              >
                길찾기
              </a>

              <a
                href={place.placeUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-center font-semibold text-amber-900 hover:bg-amber-100"
              >
                카카오맵 보기
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
