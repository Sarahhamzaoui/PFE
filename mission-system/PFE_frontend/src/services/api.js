const BASE_URL = "http://localhost/PFE/mission-system/PFE_backend/api";

// ── Auth ──────────────────────────────────────────────────────
export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// ── Missions ──────────────────────────────────────────────────

// Secretary: create a mission
export const createMission = async (missionData) => {
  const res = await fetch(`${BASE_URL}/missions/create_mission.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(missionData),
  });
  return res.json();
};

// Manager: get all missions
export const getAllMissions = async () => {
  const res = await fetch(`${BASE_URL}/missions/missions.php`);
  return res.json();
};

// Manager: accept or reject a mission
export const updateMissionStatus = async (mission_id, status) => {
  const res = await fetch(`${BASE_URL}/missions/missions.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mission_id, status }),
  });
  return res.json();
};

// DML: get accepted missions
export const getAcceptedMissions = async () => {
  const res = await fetch(`${BASE_URL}/missions/get_accepted_missions.php`);
  return res.json();
};

// ── Bookings ──────────────────────────────────────────────────

// DML: save booking
export const saveBooking = async (bookingData) => {
  const res = await fetch(`${BASE_URL}/bookings/save_booking.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });
  return res.json();
};
// DML: add new accommodation
export const addAccommodation = async (accommodationData) => {
  const res = await fetch(`${BASE_URL}/accommodations/add_accommodation.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(accommodationData),
  });
  return res.json();
};

// DML: get all accommodations
export const getAccommodations = async () => {
  const res = await fetch(`${BASE_URL}/accommodations/get_accommodations.php`);
  return res.json();
};