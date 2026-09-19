export interface Restaurant {
  id: string;
  placeName: string;
  categoryName: string;
  categoryGroupCode: string;
  categoryGroupName: string;
  phone: string;
  addressName: string;
  roadAddressName: string;
  x: string;
  y: string;
  placeUrl: string;
  distance?: string;
}

export interface RestaurantSearchResponse {
  restaurants: Restaurant[];
  totalCount: number;
  pageableCount: number;
  isEnd: boolean;
}

export interface Coordinates {
  lat: number;
  lng: number;
}
