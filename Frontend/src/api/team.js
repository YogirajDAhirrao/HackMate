const development = import.meta.env.DEV || import.meta.env.DEVELOPMENT;
const BASE_URL = development
  ? "http://localhost:5000"
  : import.meta.env.VITE_API_URL;

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

export const addProjectToTeam = async (teamId, projectData) => {
  const response = await fetch(`${BASE_URL}/add-project/${teamId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add project");
  }

  return data.project; // assuming backend returns { project: {...} }
};

export const leaveTeam = async (id) => {
  const response = await fetch(`${BASE_URL}/team/${id}/leave`, {
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

export const removeMember = async (teamId, memberId) => {
  const response = await fetch(`${BASE_URL}/team/${teamId}/remove-member`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ memberId }),
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

// POST: Accept team invite
export const acceptTeamInvite = async (inviteId) => {
  const res = await fetch(`${BASE_URL}/team-invite/${inviteId}/accept`, {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to accept team invite");
  }

  return data;
};

// POST: Reject team invite
export const rejectTeamInvite = async (inviteId) => {
  const res = await fetch(`${BASE_URL}/team-invite/${inviteId}/reject`, {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to reject invite");
  return data;
};

// /api/team.js or wherever you define API utilities
export const getIncomingTeamInvites = async () => {
  const res = await fetch(`${BASE_URL}/team-invite/incoming`, {
    credentials: "include",
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch team invites");
  }

  return data.incomingTeamInvites; // ✅ match backend key
};

export const getOutgoingTeamInvites = async () => {
  const res = await fetch(`${BASE_URL}/team-invite/outgoing`, {
    method: "GET",
    credentials: "include", // important for cookie-based auth
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch outgoing invites");
  }

  const data = await res.json();
  return data.outgoingTeamInvites; // returns array of invites
};

export const fetchMessages = async (teamId) => {
  const res = await fetch(`${BASE_URL}/chat/${teamId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch messages");
  }

  return res.json(); // ✅ Return chat data
};
