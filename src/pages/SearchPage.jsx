import { useState } from "react";
import { Search, X } from "lucide-react";
import { search } from "../services/api";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);

    try {
      const response = await search({ q: query });
      setResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
      setResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults(null);
  };

  const nothingFound =
    results &&
    results.buildings?.length === 0 &&
    results.rooms?.length === 0 &&
    results.faculty?.length === 0 &&
    results.departments?.length === 0 &&
    results.facilities?.length === 0;

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* ================== SEARCH BAR ================== */}
      <form onSubmit={handleSearch} className="relative w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search buildings, faculty, rooms..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />

          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isSearching}
          className="mt-2 w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </form>

      {/* ================== NO RESULTS ================== */}
      {nothingFound && (
        <div className="mt-6 p-4 border bg-red-50 border-red-300 text-red-700 rounded-lg">
          ❌ No results found. Try another search.
        </div>
      )}

      {/* ================== SHOW RESULTS ================== */}
      {results && !nothingFound && (
        <div className="mt-6 space-y-6">

          {/* BUILDINGS */}
          {results.buildings?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Buildings</h2>
              {results.buildings.map((b) => (
                <div key={b._id} className="p-3 border rounded-lg">
                  🏢 {b.name} <br />
                  ID: {b._id}
                </div>
              ))}
            </div>
          )}

          {/* ROOMS */}
          {results.rooms?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Rooms</h2>
              {results.rooms.map((r) => (
                <div key={r._id} className="p-3 border rounded-lg">
                  🚪 Room {r.room_no} ({r.type}) <br />
                  Building: {r.building_id?.name} <br />
                  ID: {r._id}
                </div>
              ))}
            </div>
          )}

          {/* FACULTY */}
          {results.faculty?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Faculty</h2>
              {results.faculty.map((f) => (
                <div key={f._id} className="p-3 border rounded-lg">
                  👨‍🏫 {f.name} <br />
                  ID: {f._id} <br />
                  Room: {f.room_id?.room_no}
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default SearchPage;
