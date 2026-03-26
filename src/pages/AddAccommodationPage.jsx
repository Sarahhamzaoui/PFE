import { useState } from "react";
import "../Styles/AddAccommodationPage.css";

const TIERS = ["Corporate · Tier 1", "Corporate · Tier 2", "Custom"];

export default function AddAccommodationPage({ onAdd, onBack }) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    tier: TIERS[2],
    desc: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name     = "Name is required.";
    if (!form.location.trim()) e.location = "Location is required.";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      e.price = "Enter a valid price.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const newItem = {
      id: Date.now().toString(),
      tag: form.tier,
      name: form.name,
      location: form.location,
      desc: form.desc || "User-added accommodation",
      price: Number(form.price),
      unit: "/ night",
    };

    setSubmitted(true);
    setTimeout(() => {
      onAdd?.(newItem);
      onBack?.();
    }, 1200);
  };

  return (
    <div className="add-page">
      <header className="add-header">
        <div className="add-logo">■ CORPORATE TRAVEL SYSTEM</div>
        <h1>Add <em>New Accommodation</em></h1>
        <p>Register a new housing option for business assignments</p>
      </header>

      <div className="add-container">
        {/* Back link */}
        <button className="add-back" onClick={onBack}>← Back to Booking</button>

        <div className="add-card">
          <div className="add-card__header">
            <div>
              <h2 className="add-card__title">Accommodation Details</h2>
              <p className="add-card__sub">Fill in the information below</p>
            </div>
          </div>

          <div className="add-form">
            {/* Row 1 */}
            <div className="form-row">
              <Field
                label="Accommodation Name"
                required
                error={errors.name}
              >
                <input
                  className={`form-input ${errors.name ? "is-error" : ""}`}
                  placeholder="e.g. Hilton Executive Suite"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>

              <Field label="Location" required error={errors.location}>
                <input
                  className={`form-input ${errors.location ? "is-error" : ""}`}
                  placeholder="e.g. Paris, France"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                />
              </Field>
            </div>

            {/* Row 2 */}
            <div className="form-row">
              <Field label="Price per Night ($)" required error={errors.price}>
                <input
                  className={`form-input ${errors.price ? "is-error" : ""}`}
                  type="number"
                  min="0"
                  placeholder="e.g. 180"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                />
              </Field>

              <Field label="Tier / Category">
                <select
                  className="form-input form-select"
                  value={form.tier}
                  onChange={(e) => set("tier", e.target.value)}
                >
                  {TIERS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>

            {/* Description */}
            <Field label="Description">
              <textarea
                className="form-input form-textarea"
                placeholder="Briefly describe the accommodation..."
                value={form.desc}
                onChange={(e) => set("desc", e.target.value)}
                rows={3}
              />
            </Field>
          </div>

          {/* Footer */}
          <div className="add-footer">
            <button className="btn btn-ghost" onClick={onBack}>Cancel</button>
            <button
              className={`btn btn-primary ${submitted ? "btn--success" : ""}`}
              onClick={handleSubmit}
              disabled={submitted}
            >
              {submitted ? "✓ Added!" : "Add Accommodation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helper ────────────────────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}{required && <span className="form-req">*</span>}
      </label>
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}