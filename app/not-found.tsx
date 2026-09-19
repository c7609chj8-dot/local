import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center">
        <p className="text-5xl">🍽️</p>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
          맛집 정보를 찾을 수 없습니다.
        </h1>
        <p className="mt-2 text-slate-500">
          검색 결과가 변경되었거나 상세정보를 불러오지 못했습니다.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white"
        >
          맛집 다시 검색
        </Link>
      </div>
    </main>
  );
}
