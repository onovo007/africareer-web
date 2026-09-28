export function readProfile() {
  if (typeof window === "undefined") return null;
  try {
    const profile = JSON.parse(sessionStorage.getItem("aca_user") || localStorage.getItem("aca_user") || "null");
    return profile?.version === 2 && typeof profile.name === "string" && typeof profile.participantId === "string" ? profile : null;
  } catch { return null; }
}
