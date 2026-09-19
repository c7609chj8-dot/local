import type { KakaoMapGlobal } from "@/types/kakao-map";

let sdkPromise: Promise<KakaoMapGlobal> | null = null;

export function loadKakaoMapSdk(): Promise<KakaoMapGlobal> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Kakao Map SDK는 브라우저에서만 로드할 수 있습니다."));
  }

  const kakaoWindow = window as typeof window & {
    kakao?: KakaoMapGlobal;
  };

  if (kakaoWindow.kakao?.maps) {
    return new Promise<KakaoMapGlobal>((resolve) => {
      kakaoWindow.kakao!.maps.load(() => resolve(kakaoWindow.kakao!));
    });
  }

  if (sdkPromise) {
    return sdkPromise;
  }

  const appKey = process.env.KAKAO_MAP_KEY;

  if (!appKey) {
    return Promise.reject(
      new Error("KAKAO_MAP_KEY 환경변수가 설정되지 않았습니다."),
    );
  }

  sdkPromise = new Promise<KakaoMapGlobal>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-map-sdk="true"]',
    );

    const finish = () => {
      const currentWindow = window as typeof window & {
        kakao?: KakaoMapGlobal;
      };

      if (!currentWindow.kakao?.maps) {
        reject(new Error("Kakao Map SDK 초기화에 실패했습니다."));
        return;
      }

      currentWindow.kakao.maps.load(() => resolve(currentWindow.kakao!));
    };

    if (existing) {
      if (kakaoWindow.kakao?.maps) {
        finish();
      } else {
        existing.addEventListener("load", finish, { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error("Kakao Map SDK 로드에 실패했습니다.")),
          { once: true },
        );
      }
      return;
    }

    const script = document.createElement("script");
    script.dataset.kakaoMapSdk = "true";
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false`;
    script.addEventListener("load", finish, { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("Kakao Map SDK 로드에 실패했습니다.")),
      { once: true },
    );
    document.head.appendChild(script);
  });

  return sdkPromise;
}
