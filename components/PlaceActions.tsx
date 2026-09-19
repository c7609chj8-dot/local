"use client";

import { useState } from "react";

export default function PlaceActions({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copyAddress}
      className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
    >
      {copied ? "주소 복사됨 ✓" : "주소 복사"}
    </button>
  );
}
