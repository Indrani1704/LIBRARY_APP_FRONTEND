export default function Pagination({
  page,
  total,
  setPage,
}: any) {
  return (
    <div className="flex gap-2 mt-4">
      {[...Array(total)].map((_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`px-3 py-1 ${
            page === i + 1 ? "bg-black text-white" : "bg-gray-200"
          }`} // ✅ FIX (uses page)
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}