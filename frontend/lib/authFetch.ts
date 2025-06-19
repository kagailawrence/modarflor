import { BASE_URL } from "./baseUrl";

/**
 * Wrapper for fetch that automatically refreshes the access token using the refresh token if needed.
 * Usage: import { authFetch } from "@/lib/authFetch";
 */
export async function authFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  let accessToken = localStorage.getItem("accessToken");
  let refreshToken = localStorage.getItem("refreshToken");

  // Attach access token if present
  if (accessToken) {
    init.headers = {
      ...(init.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    };
  }

  let response = await fetch(input, init);

  // If unauthorized, try to refresh the token
  if (response.status === 401 && refreshToken) {
    const refreshResponse = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        accessToken = data.accessToken;
        // Retry original request with new access token
        init.headers = {
          ...(init.headers || {}),
          Authorization: `Bearer ${accessToken}`,
        };
        response = await fetch(input, init);
      }
    } else {
      // Refresh failed, log out user
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");
      // Optionally, redirect to login page
    }
  }

  return response;
}
