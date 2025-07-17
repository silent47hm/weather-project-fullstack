

// Import environment variables from Vite
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000'; // Fallback to local backend URL

console.log('API URL:', API_URL); // Optional: for debugging

// Helper function for handling the response
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
};

// Register User
export const registerUser = async ({ username, email, password }) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include',  // Important for sending cookies
    });
    return await handleResponse(response); // Handle and return the response
  } catch (error) {
    console.error('Registration error:', error);
    throw error; // Rethrow the error for further handling in components
  }
};

// Login User
export const loginUser = async ({ email, password }) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',  // Important for sending cookies
    });
    return await handleResponse(response); // Handle and return the response
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Rethrow the error for further handling in components
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',  // Important for sending cookies
    });
    if (response.ok) {
      console.log('Logged out successfully');
    }
  } catch (error) {
    console.error('Logout error:', error);
    throw error; // Rethrow the error if needed
  }
};

export const checkAuth = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/check`, {
      credentials: 'include',
    });

    if (!response.ok) {
      // Clear token if unauthorized
      if (response.status === 401) {
        localStorage.removeItem('authToken');
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Authentication check failed');
    }

    const data = await response.json();
    
    // Ensure the response has the expected structure
    if (!data || !data.user) {
      throw new Error('Invalid user data received');
    }

    return data;
  } catch (error) {
    console.error('Auth check error:', error);
    throw error;
  }
};
