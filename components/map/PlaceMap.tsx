"use client";

import { useState } from "react";
import type { Restaurant } from "@/types/restaurant";
import KakaoMap from "./KakaoMap";

export default function PlaceMap({ place }: { place: Restaurant }) {
  const [center, setCenter] = useState({
    lat: Number(place.y),
    lng: Number(place.x),
  });

  return (
    <div className="h-72 overflow-hidden rounded-2xl border border-slate-200">
      <KakaoMap
        restaurants={[place]}
        selectedId={place.id}
        center={center}
        onCenterChange={setCenter}
        onSelect={() => undefined}
      />
    </div>
  );
}
