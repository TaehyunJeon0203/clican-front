export default function App() {
  return (
    <div className="w-[320px] p-4 font-sans">
      <h1 className="text-lg font-bold">Clican</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Google 검색 결과의 신뢰도를 별점(★1~5)으로 보여줍니다.
      </p>
      <div className="mt-3 space-y-1 text-xs text-neutral-500">
        <p>• 80점 이상 ★★★★★</p>
        <p>• 60점 이상 ★★★★☆</p>
        <p>• 40점 이상 ★★★☆☆</p>
        <p>• 20점 이상 ★★☆☆☆</p>
        <p>• 그 외 ★☆☆☆☆</p>
      </div>
    </div>
  );
}
