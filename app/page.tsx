import Header from "@/components/Header";
import RestaurantExplorer from "@/components/RestaurantExplorer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <RestaurantExplorer />
    </main>
  );
}
