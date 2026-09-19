"use client";

import Link from "next/link";
import type { Restaurant } from "@/types/restaurant";
import { buildPlaceDetailHref, formatDistance } from "@/lib/utils";

interface RestaurantCardProps {
  restaurant: Restaurant;
  selected?: boolean;
  onClick: () => void;
}

export default function RestaurantCard({
  restaurant,
  selected = false,
  onClick,
}: RestaurantCardProps) {
  const distance = formatDistance(restaurant.distance);

  return (
    <article
      className={`rounded-2xl border bg-white p-4 transition ${
        selected
          ? "border-slate-900 shadow-md ring-1 ring-slate-900"
          : "border-slate-200 hover:border-slate-400 hover:shadow-sm"
      }`}
    >
      <button type="button" onClick={onClick} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-bold text-slate-900">
              {restaurant.placeName}
            </h3>
            <p className="mt-1 line-clamp-1 text-xs text-slate-500">
              {restaurant.categoryName || restaurant.categoryGroupName}
            </p>
          </div>

          {distance && (
            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
              {distance}
            </span>
          )}
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-slate-600">
          {restaurant.roadAddressName || restaurant.addressName}
        </p>

        {restaurant.phone && (
          <p className="mt-2 text-sm text-slate-500">☎ {restaurant.phone}</p>
        )}
      </button>

      <div className="mt-4 flex gap-2">
        <Link
          href={buildPlaceDetailHref(restaurant)}
          className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-slate-700"
        >
          상세보기
        </Link>
        <a
          href={restaurant.placeUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          카카오맵
        </a>
      </div>
    </article>
  );
}
