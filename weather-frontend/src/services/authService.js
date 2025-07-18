// Import environment variables from Vite
const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:5000"; // Fallback to local backend URL

console.log("API URL:", API_URL); // Optional: for debugging done my silent

// Helper function for handling the response
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
};

// Register User
export const registerUser = async ({ username, email, password }) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
      credentials: "include", // Important for sending cookies
    });
    return await handleResponse(response); // Handle and return the response
  } catch (error) {
    console.error("Registration error:", error);
    throw error; // Rethrow the error for further handling in components
  }
};

// Login User
export const loginUser = async ({ email, password }, rememberMe) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();
    
    // Store token based on rememberMe choice
    if (rememberMe) {
      localStorage.setItem('token', data.token);
    } else {
      sessionStorage.setItem('token', data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    // Clear token from storage
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    // Call backend logout
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const checkAuth = async () => {
  // Check both storage locations
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/check`, {
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Authentication check failed');
    }

    return await response.json();
  } catch (error) {
    // Clear invalid tokens
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    throw error;
  }
};
