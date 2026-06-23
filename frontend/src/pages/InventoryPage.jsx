import { useEffect, useState, useCallback } from "react";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";
import Modal from "../components/Layout/Modal";
import PuzzleForm from "../components/Inventory/PuzzleForm";

const DIFF_LABELS = {
  easy: "badge-easy",
  medium: "badge-medium",
  hard: "badge-hard",
};

export default function InventoryPage() {
  const { addToast } = useToast();
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  // Modal state
  const [modal, setModal] = useState({ type: null, puzzle: null });

  const fetchPuzzles = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (diffFilter !== "all") params.difficulty = diffFilter;
      if (stockFilter !== "all") params.inStock = stockFilter === "inStock" ? "true" : "false";
      const { data } = await api.get("/puzzles", { params });
      setPuzzles(data);
    } catch (err) {
      addToast("Failed to load puzzles", "error");
    } finally {
      setLoading(false);
    }
  }, [search, diffFilter, stockFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchPuzzles, 300);
    return () => clearTimeout(timer);
  }, [fetchPuzzles]);

  const handleCreate = async (formData) => {
    setFormLoading(true);
    try {
      await api.post("/puzzles", formData);
      addToast("Puzzle added successfully!", "success");
      setModal({ type: null, puzzle: null });
      fetchPuzzles();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to add puzzle", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    setFormLoading(true);
    try {
      await api.put(`/puzzles/${modal.puzzle._id}`, formData);
      addToast("Puzzle updated successfully!", "success");
      setModal({ type: null, puzzle: null });
      fetchPuzzles();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to update puzzle", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/puzzles/${modal.puzzle._id}`);
      addToast("Puzzle deleted", "success");
      setModal({ type: null, puzzle: null });
      fetchPuzzles();
    } catch (err) {
      addToast("Failed to delete puzzle", "error");
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search puzzles by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        {/* Difficulty filter */}
        <select
          value={diffFilter}
          onChange={(e) => setDiffFilter(e.target.value)}
          className="input-field sm:w-40"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Stock filter */}
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="input-field sm:w-40"
        >
          <option value="all">All Stock</option>
          <option value="inStock">In Stock</option>
          <option value="outOfStock">Out of Stock</option>
        </select>

        <button
          onClick={() => setModal({ type: "create", puzzle: null })}
          className="btn-primary whitespace-nowrap"
        >
          + Add Puzzle
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Puzzle</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Size</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Stock</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Difficulty</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Category</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <svg className="animate-spin w-6 h-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Loading…
                  </td>
                </tr>
              ) : puzzles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <p className="font-medium text-gray-500">No puzzles found</p>
                    <p className="text-xs mt-1">Try adjusting your filters or add a new puzzle</p>
                  </td>
                </tr>
              ) : (
                puzzles.map((puzzle) => (
                  <tr
                    key={puzzle._id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {puzzle.imageUrl ? (
                          <img
                            src={puzzle.imageUrl}
                            alt={puzzle.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{puzzle.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{puzzle.size}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      ₹{puzzle.price.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          puzzle.stock === 0
                            ? "bg-red-100 text-red-700"
                            : puzzle.stock < 5
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {puzzle.stock === 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        )}
                        {puzzle.stock === 0 ? "Out of stock" : puzzle.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={DIFF_LABELS[puzzle.difficulty] || ""}>
                        {puzzle.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                      {puzzle.category || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setModal({ type: "edit", puzzle })}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setModal({ type: "delete", puzzle })}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && puzzles.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {puzzles.length} puzzle{puzzles.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={modal.type === "create"}
        onClose={() => setModal({ type: null, puzzle: null })}
        title="Add New Puzzle"
      >
        <PuzzleForm
          onSubmit={handleCreate}
          onCancel={() => setModal({ type: null, puzzle: null })}
          loading={formLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={modal.type === "edit"}
        onClose={() => setModal({ type: null, puzzle: null })}
        title="Edit Puzzle"
      >
        <PuzzleForm
          puzzle={modal.puzzle}
          onSubmit={handleUpdate}
          onCancel={() => setModal({ type: null, puzzle: null })}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={modal.type === "delete"}
        onClose={() => setModal({ type: null, puzzle: null })}
        title="Delete Puzzle"
        size="sm"
      >
        <div className="text-center py-2">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <p className="font-semibold text-gray-900 mb-1">Delete "{modal.puzzle?.name}"?</p>
          <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} className="btn-danger flex-1">Delete</button>
            <button
              onClick={() => setModal({ type: null, puzzle: null })}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
