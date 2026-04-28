import { useState, useEffect } from "react";
import "./Booking.css";
import Addnewhotel from "./Addnewhotel";
import { getAccommodations, saveBooking } from "../../services/api";

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
    desc: "Daily allowance for meals.",
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

// Progress Bar
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

// Card
function Card({ item, selected, onSelect }) {
  return (
    <div className={`card ${selected ? "selected" : ""}`} onClick={() => onSelect(item)}>
      <div className="card-emoji">{item.emoji}</div>
      <div className="card-body">
        <div className="card-tag">{item.tag}</div>
        <div className="card-name">{item.name}</div>
        <div className="card-desc">{item.desc}</div>
        <div className="card-price">
          <span className="price-val">{item.price}</span>
          <span className="price-unit">DA {item.unit}</span>
        </div>
      </div>
    </div>
  );
}

// Step Panel
function StepPanel({ title, subtitle, items, selected, onSelect, onNext, onBack, onAddNew }) {
  return (
    <div className="step-panel">
      <h2 className="step-title">{title}</h2>
      <p className="step-subtitle">{subtitle}</p>
      <div className="cards-grid">
        {items.map((item) => (
          <Card
            key={item.id}
            item={item}
            selected={selected?.id === item.id}
            onSelect={onSelect}
          />
        ))}
      </div>
      <div className="btn-row">
        {onBack && (
          <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        )}
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

// Summary
function Summary({ mission, selections, onConfirm, onBack, saving }) {
  const total = Object.values(selections)
    .filter(Boolean)
    .reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="summary-panel">
      <h2>Assignment Summary</h2>
      {mission && (
        <p style={{ color: "#8a93a8", marginBottom: "1rem" }}>
          Mission: <strong>{mission.title}</strong> — {mission.assigned_employee}
        </p>
      )}

      {Object.values(selections).filter(Boolean).map((item, i) => (
        <div className="summary-item" key={i}>
          <span>{item.emoji} {item.name}</span>
          <span>{item.price} DA</span>
        </div>
      ))}

      <div className="total">{total} DA</div>

      <div className="btn-row">
        <button className="btn btn-ghost" onClick={onBack}>← Edit</button>
        <button
          className="btn btn-primary"
          onClick={onConfirm}
          disabled={saving}
        >
          {saving ? "Saving..." : "Confirm Booking ✓"}
        </button>
      </div>
    </div>
  );
}

// Main
export default function BookingPage({ mission }) {
  const [step, setStep]               = useState(1);
  const [showAddPage, setShowAddPage] = useState(false);
  const [saving, setSaving]           = useState(false);
  const [accommodations, setAccommodations] = useState([
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
  ]);

  const [selections, setSelections] = useState({
    accommodation: null,
    meals: null,
    transport: null,
  });

  useEffect(() => {
    const loadAccommodations = async () => {
      try {
        const data = await getAccommodations();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((a) => ({
            id:    String(a.id),
            tag:   a.tier        || "Hotel",
            name:  a.name,
            desc:  a.description || "",
            price: Number(a.price) || 0,
            unit:  "/ night",
          }));
          setAccommodations(formatted);
        }
      } catch (err) {
        console.error("Could not load accommodations:", err);
      }
    };
    loadAccommodations();
  }, []);

  const select = (key, item) =>
    setSelections((prev) => ({ ...prev, [key]: item }));

  const handleAddAccommodation = (newItem) => {
    setAccommodations((prev) => [...prev, { ...newItem,}]);
  };

  const handleConfirm = async () => {
    if (!mission) {
      alert("No mission selected.");
      return;
    }

    const missionId = mission.id || mission.mission_id;

    if (!missionId) {
      alert("Could not find mission ID.");
      return;
    }

    setSaving(true);
    try {
      const data = await saveBooking({
        mission_id:   missionId,
        accomodation: selections.accommodation?.name || "",
        transport:    selections.transport?.name     || "",
        food:         selections.meals?.name         || "",
      });

      if (data.message === "Booking saved successfully") {
       const handleSaveBooking = async (id, accomodation, transport, food) => {
  try {
    const data = await saveBooking({ mission_id: id, accomodation, transport, food });

    if (data.message === "Booking saved successfully") {
      setMissionList(prev =>
        prev.map(m =>
          m.id === id ? { ...m, booked: "1", accomodation, transport, food } : m
        )
      );

      setSelectedMission(null);

      // ✅ show success message
      setMessage("Booking saved successfully ✓");

      // auto hide after 3 seconds
      setTimeout(() => setMessage(""), 3000);

    } else {
      setMessage(data.error || "Something went wrong");
      setTimeout(() => setMessage(""), 3000);
    }
  } catch {
    setMessage("Server error, please try again");
    setTimeout(() => setMessage(""), 3000);
  }
};
      } else {
        alert(data.error || "Failed to save booking");
      }
    } catch (err) {
      alert("Server error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (showAddPage) {
    return (
      <Addnewhotel
        onAdd={handleAddAccommodation}
        onBack={() => setShowAddPage(false)}
      />
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Plan <em>Business Mission</em></h1>
        {mission && (
          <p>
            Booking for: <strong>{mission.title}</strong> — {mission.assigned_employee}
          </p>
        )}
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
            mission={mission}
            selections={selections}
            onBack={() => setStep(3)}
            onConfirm={handleConfirm}
            saving={saving}
          />
        )}
      </main>
    </div>
  );
}