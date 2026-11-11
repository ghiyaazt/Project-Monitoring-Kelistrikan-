interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalResults: number;
  totalKos: number;
  isDark: boolean;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  totalResults,
  totalKos,
  isDark
}: SearchBarProps) {
  return (
    <div className="mb-6">
      <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-4`}>
        <div className="flex items-center gap-3">
          <svg className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari berdasarkan nama atau alamat kos..."
            className={`flex-1 bg-transparent border-none outline-none text-sm ${
              isDark ? 'text-white placeholder-slate-400' : 'text-gray-900 placeholder-gray-500'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className={`text-sm font-medium ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {searchQuery && (
        <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
          Menampilkan {totalResults} dari {totalKos} properti
        </p>
      )}
    </div>
  );
}
