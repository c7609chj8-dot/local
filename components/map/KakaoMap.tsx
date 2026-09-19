"use client";

import { useEffect, useRef, useState } from "react";
import { loadKakaoMapSdk } from "@/lib/kakao/client";
import type {
  KakaoMapGlobal,
  KakaoMapInstance,
  KakaoMarkerInstance,
} from "@/types/kakao-map";
import type { Coordinates, Restaurant } from "@/types/restaurant";

interface KakaoMapProps {
  restaurants: Restaurant[];
  selectedId?: string;
  center: Coordinates;
  onCenterChange: (center: Coordinates) => void;
  onSelect: (restaurant: Restaurant) => void;
}

export default function KakaoMap({
  restaurants,
  selectedId,
  center,
  onCenterChange,
  onSelect,
}: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMapInstance | null>(null);
  const kakaoRef = useRef<KakaoMapGlobal | null>(null);
  const markersRef = useRef<KakaoMarkerInstance[]>([]);
  const onCenterChangeRef = useRef(onCenterChange);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onCenterChangeRef.current = onCenterChange;
  }, [onCenterChange]);

  useEffect(() => {
    let active = true;

    loadKakaoMapSdk()
      .then((kakao) => {
        if (!active || !containerRef.current) return;

        kakaoRef.current = kakao;
        const map = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(center.lat, center.lng),
          level: 5,
        });
        mapRef.current = map;

        kakao.maps.event.addListener(map, "idle", () => {
          const current = map.getCenter();
          onCenterChangeRef.current({
            lat: current.getLat(),
            lng: current.getLng(),
          });
        });
      })
      .catch((sdkError: unknown) => {
        const message =
          sdkError instanceof Error
            ? sdkError.message
            : "카카오맵을 불러오지 못했습니다.";
        setError(message);
      });

    return () => {
      active = false;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const kakao = kakaoRef.current;
    const map = mapRef.current;
    if (!kakao || !map) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    if (restaurants.length === 0) return;

    const bounds = new kakao.maps.LatLngBounds();

    restaurants.forEach((restaurant) => {
      const lat = Number(restaurant.y);
      const lng = Number(restaurant.x);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const position = new kakao.maps.LatLng(lat, lng);
      const marker = new kakao.maps.Marker({
        map,
        position,
        title: restaurant.placeName,
      });

      kakao.maps.event.addListener(marker, "click", () => onSelect(restaurant));
      bounds.extend(position);
      markersRef.current.push(marker);
    });

    if (markersRef.current.length === 1) {
      map.setCenter(markersRef.current[0].getPosition());
    } else if (markersRef.current.length > 1) {
      map.setBounds(bounds);
    }
  }, [restaurants, onSelect]);

  useEffect(() => {
    if (!selectedId) return;
    const kakao = kakaoRef.current;
    const map = mapRef.current;
    if (!kakao || !map) return;

    const selected = restaurants.find((item) => item.id === selectedId);
    if (!selected) return;

    const lat = Number(selected.y);
    const lng = Number(selected.x);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    map.panTo(new kakao.maps.LatLng(lat, lng));
  }, [selectedId, restaurants]);

  useEffect(() => {
    const kakao = kakaoRef.current;
    const map = mapRef.current;
    if (!kakao || !map) return;
    const current = map.getCenter();
    const moved =
      Math.abs(current.getLat() - center.lat) > 0.000001 ||
      Math.abs(current.getLng() - center.lng) > 0.000001;

    if (moved) {
      map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
    }
  }, [center.lat, center.lng]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-100 p-6 text-center">
        <div>
          <p className="font-semibold text-rose-700">지도 로딩 실패</p>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
          <p className="mt-2 text-xs text-slate-500">
            JavaScript 키와 등록 도메인을 확인해 주세요.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" aria-label="카카오 맛집 지도" />;
}
