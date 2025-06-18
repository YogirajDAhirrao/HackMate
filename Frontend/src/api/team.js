const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getMyTeam = async () => {
  const response = await fetch(`${BASE_URL}/team/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch team data");
  }

  const data = await response.json();
  return data.team;
};

export const leaveTeam = async () => {
  const response = await fetch(`${BASE_URL}/team/leave`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to leave team");
  }

  return await response.json();
};