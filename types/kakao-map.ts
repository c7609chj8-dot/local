export interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

export interface KakaoMapInstance {
  setCenter(position: KakaoLatLng): void;
  panTo(position: KakaoLatLng): void;
  getCenter(): KakaoLatLng;
  setBounds(bounds: KakaoLatLngBounds): void;
  relayout(): void;
}

export interface KakaoMarkerInstance {
  setMap(map: KakaoMapInstance | null): void;
  getPosition(): KakaoLatLng;
}

export interface KakaoLatLngBounds {
  extend(position: KakaoLatLng): void;
}

export interface KakaoMapGlobal {
  maps: {
    load(callback: () => void): void;
    Map: new (
      container: HTMLElement,
      options: { center: KakaoLatLng; level?: number },
    ) => KakaoMapInstance;
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    Marker: new (options: {
      map?: KakaoMapInstance;
      position: KakaoLatLng;
      title?: string;
    }) => KakaoMarkerInstance;
    LatLngBounds: new () => KakaoLatLngBounds;
    event: {
      addListener(
        target: KakaoMapInstance | KakaoMarkerInstance,
        eventName: string,
        handler: () => void,
      ): void;
    };
  };
}
