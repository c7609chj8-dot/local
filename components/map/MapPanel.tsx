"use client";

import type { Coordinates, Restaurant } from "@/types/restaurant";
import KakaoMap from "./KakaoMap";

interface MapPanelProps {
  restaurants: Restaurant[];
  selectedId?: string;
  center: Coordinates;
  loading?: boolean;
  onCenterChange: (center: Coordinates) => void;
  onSelect: (restaurant: Restaurant) => void;
  onResearch: () => void;
  onLocate: () => void;
}

export default function MapPanel({
  restaurants,
  selectedId,
  center,
  loading = false,
  onCenterChange,
  onSelect,
  onResearch,
  onLocate,
}: MapPanelProps) {
  return (
    <section className="relative h-[calc(100vh-13rem)] min-h-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-200">
      <KakaoMap
        restaurants={restaurants}
        selectedId={selectedId}
        center={center}
        onCenterChange={onCenterChange}
        onSelect={onSelect}
      />

      <div className="absolute left-4 top-4 rounded-xl bg-white/95 px-3 py-2 shadow">
        <p className="text-sm font-semibold text-slate-800">
          맛집 {restaurants.length}곳
        </p>
      </div>

      <button
        type="button"
        onClick={onLocate}
        className="absolute right-4 top-4 rounded-xl bg-white/95 px-3 py-2 text-sm font-semibold text-slate-700 shadow hover:bg-white"
      >
        ◎ 내 위치
      </button>

      <button
        type="button"
        onClick={onResearch}
        disabled={loading}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-lg transition hover:bg-slate-50 disabled:opacity-50"
      >
        ↻ {loading ? "검색 중" : "현재 지도에서 다시 검색"}
      </button>
    </section>
  );
}
