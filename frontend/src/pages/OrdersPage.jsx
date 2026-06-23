import { useEffect, useState, useCallback } from "react";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";
import Modal from "../components/Layout/Modal";

const STATUS_FLOW = { pending: "shipped", shipped: "delivered" };

export default function OrdersPage() {
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ customerName: "", puzzleId: "", quantity: 1 });
  const [formError, setFormError] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch {
      addToast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    api.get("/puzzles").then(({ data }) => setPuzzles(data)).catch(() => {});
  }, [fetchOrders]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.customerName.trim() || !form.puzzleId || form.quantity < 1) {
      setFormError("Please fill all required fields.");
      return;
    }
    setFormLoading(true);
    try {
      await api.post("/orders", { ...form, quantity: Number(form.quantity) });
      addToast("Order created successfully!", "success");
      setShowCreate(false);
      setForm({ customerName: "", puzzleId: "", quantity: 1 });
      fetchOrders();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create order";
      setFormError(msg);
      addToast(msg, "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleAdvanceStatus = async (order) => {
    const next = STATUS_FLOW[order.status];
    if (!next) return;
    try {
      await api.put(`/orders/${order._id}`, { status: next });
      addToast(`Order marked as ${next}`, "success");
      fetchOrders();
    } catch {
      addToast("Failed to update status", "error");
    }
  };

  const selectedPuzzle = puzzles.find((p) => p._id === form.puzzleId);
  const estimatedTotal = selectedPuzzle ? selectedPuzzle.price * Number(form.quantity) : 0;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {!loading && `${orders.length} order${orders.length !== 1 ? "s" : ""} total`}
        </p>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          + New Order
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Puzzle</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Qty</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Action</th>
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
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <p className="font-medium text-gray-500">No orders yet</p>
                    <p className="text-xs mt-1">Create your first order using the button above</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{order.customerName}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <div>
                        <p className="font-medium text-gray-800">{order.puzzleId?.name || "—"}</p>
                        <p className="text-xs text-gray-400">{order.puzzleId?.size}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{order.quantity}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      ₹{order.totalPrice.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge-${order.status}`}>{order.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {STATUS_FLOW[order.status] ? (
                        <button
                          onClick={() => handleAdvanceStatus(order)}
                          className="text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline"
                        >
                          Mark {STATUS_FLOW[order.status]}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); setFormError(""); }}
        title="Create New Order"
        size="sm"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Customer Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Ramesh Kumar"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Puzzle <span className="text-red-400">*</span>
            </label>
            <select
              className="input-field"
              value={form.puzzleId}
              onChange={(e) => setForm({ ...form, puzzleId: e.target.value })}
              required
            >
              <option value="">Select a puzzle…</option>
              {puzzles
                .filter((p) => p.stock > 0)
                .map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} — ₹{p.price} (Stock: {p.stock})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Quantity <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              className="input-field"
              min={1}
              max={selectedPuzzle?.stock || 999}
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              required
            />
            {selectedPuzzle && (
              <p className="text-xs text-gray-400 mt-1">
                Max available: {selectedPuzzle.stock}
              </p>
            )}
          </div>

          {estimatedTotal > 0 && (
            <div className="bg-brand-50 border border-brand-200 rounded-lg p-3 text-sm">
              <span className="text-gray-600">Estimated total: </span>
              <span className="font-bold text-brand-600">
                ₹{estimatedTotal.toLocaleString("en-IN")}
              </span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={formLoading} className="btn-primary flex-1">
              {formLoading ? "Creating…" : "Create Order"}
            </button>
            <button
              type="button"
              onClick={() => { setShowCreate(false); setFormError(""); }}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
