"use client";

import type { Restaurant } from "@/types/restaurant";
import RestaurantCard from "./RestaurantCard";

interface RestaurantListProps {
  restaurants: Restaurant[];
  selectedId?: string;
  onSelect: (restaurant: Restaurant) => void;
}

export default function RestaurantList({
  restaurants,
  selectedId,
  onSelect,
}: RestaurantListProps) {
  if (restaurants.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <p className="font-semibold text-slate-700">검색 결과가 없습니다.</p>
        <p className="mt-1 text-sm text-slate-500">
          지역명이나 음식명을 바꿔 다시 검색해 보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          selected={selectedId === restaurant.id}
          onClick={() => onSelect(restaurant)}
        />
      ))}
    </div>
  );
}
