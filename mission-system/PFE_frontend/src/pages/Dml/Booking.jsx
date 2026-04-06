import{ useLocation, useNavigate} from "react-router-dom";
import { saveBooking } from "../../services/api";
import { useState } from "react";
import "./Booking.css";
// ── Data ──────────────────────────────────────────────────────────────────────
const ACCOMMODATIONS = [
  {
    id: "h1",
    tag: "Corporate · Tier 1",
    name: "Executive Residence",
    desc: "Premium company-approved housing with workspace.",
    price: 220,
    unit: "/ night",
  },
  {
    id: "h2",
    tag: "Corporate · Tier 2",
    name: "Business Apartment",
    desc: "Comfortable apartment for assignments.",
    price: 140,
    unit: "/ night",
  },
];

const MEALS = [
  {
    id: "r1",
    tag: "Full Package",
    name: "Full Meal Plan",
    desc: "All meals included daily.",
    price: 40,
    unit: "/ day",
  },
  {
    id: "r2",
    tag: "Flexible",
    name: "Meal Allowance",
    desc: "Daily allowance.",
    price: 15,
    unit: "/ day",
  },
];

const TRANSPORTS = [
  {
    id: "t1",
    tag: "Company Vehicle",
    name: "Assigned Car",
    desc: "Company vehicle access.",
    price: 60,
    unit: "/ day",
  },
  {
    id: "t2",
    tag: "Air Travel",
    name: "Business Flight",
    desc: "Business class flight.",
    price: 300,
    unit: "/ ticket",
  },
];

const STEPS = ["Accommodation", "Meals", "Transport"];

// ── Components ───────────────────────────────────────────────────────────────

function ProgressBar({ currentStep }) {
  const fillPct = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="progress-wrap">
      <div className="progress-steps">
        <div className="progress-line">
          <div className="progress-line-fill" style={{ width: `${fillPct}%` }} />
        </div>

        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          return (
            <div key={label} className={`step-dot ${stepNum === currentStep ? "active" : ""}`}>
              <div className="dot-circle">{stepNum}</div>
              <span className="dot-label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Card({ item, selected, onSelect }) {
  return (
    <div className={`card ${selected ? "selected" : ""}`} onClick={() => onSelect(item)}>
      <div className="card-emoji">{item.emoji}</div>
      <div className="card-body">
        <div className="card-tag">{item.tag}</div>
        <div className="card-name">{item.name}</div>
        <div className="card-desc">{item.desc}</div>
        <div className="card-price">
          <span className="price-val">${item.price}</span>
          <span className="price-unit">{item.unit}</span>
        </div>
      </div>
    </div>
  );
}

function StepPanel({ title, subtitle, items, selected, onSelect, onNext, onBack, onAddNew }) {
  return (
    <div className="step-panel">
      <h2 className="step-title">{title}</h2>
      <p className="step-subtitle">{subtitle}</p>

      <div className="cards-grid">
        {items.map((item) => (
          <Card key={item.id} item={item} selected={selected?.id === item.id} onSelect={onSelect} />
        ))}
      </div>

      <div className="btn-row">
        {onBack && <button className="btn btn-ghost" onClick={onBack}>← Back</button>}

        <button className="btn btn-primary" disabled={!selected} onClick={onNext}>
          Continue →
        </button>

        {onAddNew && (
          <button className="btn btn-add" onClick={onAddNew}>
            + Add New Accommodation
          </button>
        )}
      </div>
    </div>
  );
}

function Summary({ selections, onConfirm, onBack }) {
  const total = Object.values(selections).reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="summary-panel">
      <h2>Assignment Summary</h2>
      <p>Review mission configuration</p>

      {Object.values(selections).map((item, i) => (
        <div className="summary-item" key={i}>
          <span>{item.name}</span>
          <span>${item.price}</span>
        </div>
      ))}

      <div className="total">Total: ${total}</div>

      <div className="btn-row">
        <button className="btn btn-ghost" onClick={onBack}>Edit</button>
        <button className="btn btn-primary" onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [showAddPage, setShowAddPage] = useState(false);
  const [accommodations, setAccommodations] = useState(ACCOMMODATIONS);

  const [selections, setSelections] = useState({
    accommodation: null,
    meals: null,
    transport: null,
  });

  const select = (key, item) =>
    setSelections((prev) => ({ ...prev, [key]: item }));

  const handleAddAccommodation = (newItem) => {
    setAccommodations((prev) => [...prev, newItem]);
  };

  // ── Render Add Accommodation page ─────────────────
  if (showAddPage) {
    return (
      <AddAccommodationPage
        onAdd={handleAddAccommodation}
        onBack={() => setShowAddPage(false)}
      />
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div className="logo"></div>
        <h1>Plan<em>Business Mission</em></h1>
        <p>Configure logistics for your assignment</p>
      </header>

      <ProgressBar currentStep={step} />

      <main className="booking-container">
        {step === 1 && (
          <StepPanel
            title="Select Accommodation"
            subtitle="Choose company-approved housing"
            items={accommodations}
            selected={selections.accommodation}
            onSelect={(item) => select("accommodation", item)}
            onNext={() => setStep(2)}
            onAddNew={() => setShowAddPage(true)}
          />
        )}

        {step === 2 && (
          <StepPanel
            title="Select Meals"
            subtitle="Assign meal plan"
            items={MEALS}
            selected={selections.meals}
            onSelect={(item) => select("meals", item)}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <StepPanel
            title="Select Transport"
            subtitle="Choose transport method"
            items={TRANSPORTS}
            selected={selections.transport}
            onSelect={(item) => select("transport", item)}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <Summary
            selections={selections}
            onBack={() => setStep(3)}
            onConfirm={() => alert("Mission Confirmed")}
          />
        )}
      </main>
    </div>
  );
}