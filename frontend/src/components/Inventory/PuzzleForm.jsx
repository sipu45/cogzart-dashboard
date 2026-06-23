import { useState, useEffect } from "react";

const initialForm = {
  name: "",
  size: "10 inch",
  price: "",
  stock: "",
  difficulty: "medium",
  category: "",
  imageUrl: "",
};

export default function PuzzleForm({ puzzle, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (puzzle) {
      setForm({
        name: puzzle.name || "",
        size: puzzle.size || "10 inch",
        price: puzzle.price ?? "",
        stock: puzzle.stock ?? "",
        difficulty: puzzle.difficulty || "medium",
        category: puzzle.category || "",
        imageUrl: puzzle.imageUrl || "",
      });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [puzzle]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.price || isNaN(form.price) || Number(form.price) < 0)
      errs.price = "Valid price is required";
    if (form.stock === "" || isNaN(form.stock) || Number(form.stock) < 0)
      errs.stock = "Valid stock quantity is required";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({ ...form, price: Number(form.price), stock: Number(form.stock) });
  };

  const Field = ({ label, name, type = "text", children, required }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children || (
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          className={`input-field ${errors[name] ? "border-red-400 ring-1 ring-red-400" : ""}`}
        />
      )}
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Puzzle Name" name="name" required />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Size" name="size" required>
          <select name="size" value={form.size} onChange={handleChange} className="input-field">
            {["6 inch", "8 inch", "10 inch", "12 inch", "16 inch"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>

        <Field label="Difficulty" name="difficulty" required>
          <select name="difficulty" value={form.difficulty} onChange={handleChange} className="input-field">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (₹)" name="price" type="number" required />
        <Field label="Stock (units)" name="stock" type="number" required />
      </div>

      <Field label="Category" name="category">
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. Nature, Monuments, Wildlife"
          className="input-field"
        />
      </Field>

      <Field label="Image URL" name="imageUrl">
        <input
          type="url"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="input-field"
        />
      </Field>

      {form.imageUrl && (
        <div className="rounded-lg overflow-hidden h-32 bg-gray-100">
          <img
            src={form.imageUrl}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? "Saving…" : puzzle ? "Save Changes" : "Add Puzzle"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  );
}
