"use client";

interface SearchBarProps {
  value: string;
  loading?: boolean;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export default function SearchBar({
  value,
  loading = false,
  onChange,
  onSearch,
}: SearchBarProps) {
  return (
    <form
      className="flex w-full gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      <label htmlFor="restaurant-search" className="sr-only">
        맛집 검색
      </label>

      <input
        id="restaurant-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="지역이나 음식점을 검색하세요. 예: 서면 삼겹살"
        className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
      />

      <button
        type="submit"
        disabled={loading}
        className="shrink-0 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "검색 중" : "검색"}
      </button>
    </form>
  );
}
