export const logoutUser = async () => {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Logout failed.");
  }

  return true;
};
