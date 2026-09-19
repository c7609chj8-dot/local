"use client";

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export interface CategorySearchConfig {
  keyword: string;
  categoryGroupCode: "FD6" | "CE7";
}

export const categoryConfig: Record<string, CategorySearchConfig> = {
  "내 주변": { keyword: "", categoryGroupCode: "FD6" },
  한식: { keyword: "한식", categoryGroupCode: "FD6" },
  고기: { keyword: "삼겹살 고기", categoryGroupCode: "FD6" },
  국밥: { keyword: "국밥", categoryGroupCode: "FD6" },
  중식: { keyword: "중식 중국집", categoryGroupCode: "FD6" },
  일식: { keyword: "일식 초밥", categoryGroupCode: "FD6" },
  분식: { keyword: "분식", categoryGroupCode: "FD6" },
  치킨: { keyword: "치킨", categoryGroupCode: "FD6" },
  해산물: { keyword: "횟집 해산물", categoryGroupCode: "FD6" },
  양식: { keyword: "양식 파스타", categoryGroupCode: "FD6" },
  카페: { keyword: "카페", categoryGroupCode: "CE7" },
  디저트: { keyword: "디저트 베이커리", categoryGroupCode: "CE7" },
};

const categories = Object.keys(categoryConfig);

export default function CategoryFilter({
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
      {categories.map((category) => {
        const active = selected === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
              active
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
