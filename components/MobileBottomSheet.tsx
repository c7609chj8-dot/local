"use client";

import type { Restaurant } from "@/types/restaurant";
import RestaurantList from "./restaurant/RestaurantList";

interface MobileBottomSheetProps {
  restaurants: Restaurant[];
  selectedId?: string;
  open: boolean;
  onToggle: () => void;
  onSelect: (restaurant: Restaurant) => void;
}

export default function MobileBottomSheet({
  restaurants,
  selectedId,
  open,
  onToggle,
  onSelect,
}: MobileBottomSheetProps) {
  return (
    <aside
      className={`fixed inset-x-0 bottom-0 z-30 rounded-t-3xl border-t border-slate-200 bg-white shadow-2xl transition-all duration-300 lg:hidden ${
        open ? "h-[55vh]" : "h-20"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex h-20 w-full flex-col items-center justify-center"
        aria-expanded={open}
      >
        <span className="mb-2 h-1 w-10 rounded-full bg-slate-300" />
        <span className="font-semibold text-slate-800">
          맛집 검색결과 {restaurants.length}곳 {open ? "↓" : "↑"}
        </span>
      </button>

      {open && (
        <div className="h-[calc(55vh-5rem)] overflow-y-auto px-4 pb-6">
          <RestaurantList
            restaurants={restaurants}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        </div>
      )}
    </aside>
  );
}
