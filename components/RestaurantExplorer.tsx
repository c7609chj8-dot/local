"use client";

import { useCallback, useState } from "react";
import type {
  Coordinates,
  Restaurant,
  RestaurantSearchResponse,
} from "@/types/restaurant";
import SearchBar from "./SearchBar";
import CategoryFilter, { categoryConfig } from "./CategoryFilter";
import MapPanel from "./map/MapPanel";
import RestaurantList from "./restaurant/RestaurantList";
import MobileBottomSheet from "./MobileBottomSheet";

const DEFAULT_CENTER: Coordinates = {
  lat: 37.5665,
  lng: 126.978,
};

async function parseApiResponse(response: Response): Promise<RestaurantSearchResponse> {
  const body = (await response.json()) as RestaurantSearchResponse & {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(body.message || "맛집을 검색하지 못했습니다.");
  }

  return body;
}

export default function RestaurantExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("내 주변");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [mapCenter, setMapCenter] = useState<Coordinates>(DEFAULT_CENTER);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyResult = useCallback((data: RestaurantSearchResponse) => {
    setRestaurants(data.restaurants);
    setSelectedId(data.restaurants[0]?.id);
    setSheetOpen(true);
  }, []);

  const searchKeyword = useCallback(
    async (
      searchText: string,
      center?: Coordinates,
      categoryGroupCode: "FD6" | "CE7" = "FD6",
    ) => {
      const keyword = searchText.trim();
      if (!keyword) {
        setError("지역이나 음식명을 입력해 주세요.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          query: keyword,
          size: "15",
          categoryGroupCode,
        });
        if (center) {
          params.set("x", String(center.lng));
          params.set("y", String(center.lat));
          params.set("radius", "20000");
        }

        const response = await fetch(`/api/restaurants/search?${params.toString()}`);
        applyResult(await parseApiResponse(response));
      } catch (searchError) {
        setError(
          searchError instanceof Error
            ? searchError.message
            : "맛집검색 중 오류가 발생했습니다.",
        );
      } finally {
        setLoading(false);
      }
    },
    [applyResult],
  );

  const searchNearby = useCallback(
    async (center: Coordinates) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          x: String(center.lng),
          y: String(center.lat),
          radius: "3000",
          size: "15",
        });
        const response = await fetch(`/api/restaurants/nearby?${params.toString()}`);
        applyResult(await parseApiResponse(response));
      } catch (searchError) {
        setError(
          searchError instanceof Error
            ? searchError.message
            : "주변 맛집검색 중 오류가 발생했습니다.",
        );
      } finally {
        setLoading(false);
      }
    },
    [applyResult],
  );

  const requestCurrentLocation = useCallback(
    (afterLocate?: (center: Coordinates) => void) => {
      if (!navigator.geolocation) {
        setError("이 브라우저에서는 위치 정보를 사용할 수 없습니다.");
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(center);
          setLoading(false);
          afterLocate?.(center);
        },
        () => {
          setLoading(false);
          setError(
            "현재 위치를 확인할 수 없습니다. 브라우저 위치 권한을 허용해 주세요.",
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      );
    },
    [],
  );

  const handleSearch = () => {
    const config = categoryConfig[category];
    const keyword = [query.trim(), category === "내 주변" ? "" : config.keyword]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (keyword) {
      void searchKeyword(keyword, mapCenter, config.categoryGroupCode);
    } else {
      requestCurrentLocation((center) => void searchNearby(center));
    }
  };

  const handleCategory = (value: string) => {
    setCategory(value);

    if (value === "내 주변") {
      requestCurrentLocation((center) => void searchNearby(center));
      return;
    }

    const config = categoryConfig[value];
    void searchKeyword(config.keyword, mapCenter, config.categoryGroupCode);
  };

  const handleResearch = () => {
    const config = categoryConfig[category];
    const keyword = [query.trim(), category === "내 주변" ? "" : config.keyword]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (keyword) {
      void searchKeyword(keyword, mapCenter, config.categoryGroupCode);
    } else {
      void searchNearby(mapCenter);
    }
  };

  const handleSelect = useCallback((restaurant: Restaurant) => {
    setSelectedId(restaurant.id);
    setMapCenter({ lat: Number(restaurant.y), lng: Number(restaurant.x) });
  }, []);

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-4">
        <div className="space-y-3">
          <SearchBar
            value={query}
            loading={loading}
            onChange={setQuery}
            onSearch={handleSearch}
          />

          <CategoryFilter selected={category} onSelect={handleCategory} />
        </div>

        {error && (
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(360px,2fr)]">
          <MapPanel
            restaurants={restaurants}
            selectedId={selectedId}
            center={mapCenter}
            loading={loading}
            onCenterChange={setMapCenter}
            onSelect={handleSelect}
            onResearch={handleResearch}
            onLocate={() =>
              requestCurrentLocation((center) => void searchNearby(center))
            }
          />

          <aside className="hidden h-[calc(100vh-13rem)] min-h-[520px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 lg:block">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  맛집 검색결과
                </h2>
                <p className="text-sm text-slate-500">
                  총 {restaurants.length}곳
                </p>
              </div>
              {loading && <span className="text-xs text-slate-500">불러오는 중…</span>}
            </div>

            <RestaurantList
              restaurants={restaurants}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          </aside>
        </div>
      </div>

      <MobileBottomSheet
        restaurants={restaurants}
        selectedId={selectedId}
        open={sheetOpen}
        onToggle={() => setSheetOpen((previous) => !previous)}
        onSelect={handleSelect}
      />
    </>
  );
}
