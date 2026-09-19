import type { KakaoPlaceDocument } from "@/types/kakao";
import type { Restaurant } from "@/types/restaurant";

export function mapKakaoPlace(document: KakaoPlaceDocument): Restaurant {
  return {
    id: document.id,
    placeName: document.place_name,
    categoryName: document.category_name,
    categoryGroupCode: document.category_group_code,
    categoryGroupName: document.category_group_name,
    phone: document.phone,
    addressName: document.address_name,
    roadAddressName: document.road_address_name,
    x: document.x,
    y: document.y,
    placeUrl: document.place_url,
    distance: document.distance || undefined,
  };
}
