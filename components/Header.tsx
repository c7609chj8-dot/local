import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">🍽️</span>
          <div>
            <p className="text-lg font-extrabold text-slate-900">맛집지도</p>
            <p className="hidden text-xs text-slate-500 sm:block">
              카카오맵으로 찾는 우리동네 맛집
            </p>
          </div>
        </Link>

        <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
          Kakao Map
        </span>
      </div>
    </header>
  );
}
