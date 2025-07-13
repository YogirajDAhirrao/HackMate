const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Get logged-in user's profile
export const getProfile = async () => {
  const res = await fetch(`${BASE_URL}/profile/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Not authenticated");
  }

  return res.json(); // returns user object
};

// Sign up user
export const signup = async (formData) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Signup failed");
  }

  return res.json(); // returns user object
};

// Log in user
export const login = async (credentials) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  return res.json(); // returns user object
};

export const getUsers = async (query) => {
  const response = await fetch(`${BASE_URL}/users?${query.toString()}`, {
    // Changed from /api/users to /users
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include credentials for JWT cookies
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to fetch users: ${response.status} ${response.statusText} - ${text}`
    );
  }
  const data = await response.json();
  return data.users;
};

export const updateProfile = async (formData) => {
  const response = await fetch(`${BASE_URL}/profile/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "update failed");
  }
  return response.json();
};

export const getUserByID = async (slug) => {
  const response = await fetch(`${BASE_URL}/users/${slug}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch user");
  }
  const data = await response.json();
  return data.user;
};

//request APIs
export const sendFriendRequest = async (userId) => {
  const response = await fetch(`${BASE_URL}/friend-request/${userId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to send friend request");
  }

  return await response.json();
};

export const acceptRequest = async (targetid) => {
  const response = await fetch(
    `${BASE_URL}/friend-request/${targetid}/accept`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || "Failed to accept request");
  }
  return response.json();
};

export const rejectRequest = async (targetid) => {
  const response = await fetch(
    `${BASE_URL}/friend-request/${targetid}/reject`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || "Failed to reject request");
  }
  return response.json();
};

export const cancelRequests = async (targetid) => {
  const response = await fetch(`${BASE_URL}/request/cancel/${targetid}`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || "Failed to cancel request");
  }
  return response.json();
};

export const getIncomingRequests = async () => {
  const response = await fetch(`${BASE_URL}/friend-request/incoming`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || "Failed to fetch requests");
  }
  const data = await response.json();
  return data.incomingRequests;
};
export const getFriends = async () => {};
export const sendTeamInvite = async (teamID, inviteeID) => {
  const response = await fetch(
    `${BASE_URL}/team-invite/${teamID}/${inviteeID}`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || "Failed to send team Invite");
  }
  const data = await response.json();
  return data;
};
