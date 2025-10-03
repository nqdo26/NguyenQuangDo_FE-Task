import RevenueTrendChart from "@/components/RevenueTrendChart";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8 bg-gray-50">
      <main className="max-w-7xl mx-auto">
        <div className="mb-8"></div>
        <RevenueTrendChart />
      </main>
    </div>
  );
}
