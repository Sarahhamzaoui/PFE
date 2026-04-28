import { useState } from "react";
import "./Addnewhotel.css";
import { addAccommodation } from "../../services/api";

const TIERS = ["Corporate · Tier 1", "Corporate · Tier 2", "Custom"];

export default function Addnewhotel({ onAdd, onBack }) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    tier: TIERS[2],
    desc: "",
  });
  const [isFree, setIsFree]     = useState(false);
  const [errors, setErrors]     = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleFreeToggle = () => {
    setIsFree((prev) => {
      if (!prev) {
        set("price", "0");
        setErrors((e) => ({ ...e, price: "" }));
      } else {
        set("price", "");
      }
      return !prev;
    });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name     = "Name is required.";
    if (!form.location.trim()) e.location = "Location is required.";
    if (!isFree && (!form.price || isNaN(form.price) || Number(form.price) <= 0))
      e.price = "Enter a valid price or mark as free.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const newItem = {
      id:       Date.now().toString(),
      tag:      form.tier,
      name:     form.name,
      location: form.location,
      desc:     form.desc || "User-added accommodation",
      price:    isFree ? 0 : Number(form.price),
      unit:     "/ night",
    };

    try {
      const res = await addAccommodation(newItem);
      if (res.success) {
        newItem.id = res.id.toString();
        setSubmitted(true);
        setTimeout(() => {
          onAdd?.(newItem);
          onBack?.();
        }, 1200);
      } else {
        alert("Failed to save: " + res.message);
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  return (
    <div className="add-page">
      <header className="add-header">
        <h1>Add <em>New Accommodation</em></h1>
        <p>Register a new housing option for business assignments</p>
      </header>

      <div className="add-container">
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
              <Field label="Accommodation Name" required error={errors.name}>
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
              <Field label="Price per Night (DA)" required error={errors.price}>
                <input
                  className={`form-input ${errors.price ? "is-error" : ""}`}
                  type="number"
                  min="0"
                  placeholder="e.g. 180"
                  value={isFree ? "" : form.price}
                  disabled={isFree}
                  onChange={(e) => set("price", e.target.value)}
                />
                {/* Free checkbox */}
                <label className="free-checkbox">
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={handleFreeToggle}
                  />
                  <span className="free-checkbox__box" />
                  <span className="free-checkbox__label">Free / Included</span>
                </label>
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