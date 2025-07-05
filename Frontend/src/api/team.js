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
  return data.teams; 
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

export const removeMember = async (memberId) => {
  const response = await fetch(`${BASE_URL}/team/remove-member/${memberId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to remove member");
  }

  return await response.json();
};

export const createTeam = async (teamData) => {
  const response = await fetch(`${BASE_URL}/team/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(teamData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create team");
  }
  return await response.json();
};
