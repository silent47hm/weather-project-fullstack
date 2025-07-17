/**
 * Service for handling authentication
 * @module services/authService
 */

/**
 * Registers a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email
 * @param {string} userData.password - Password
 * @returns {Promise<Object>} - Response data
 */
export const registerUser = async ({ username, email, password }) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include' // Important for cookies
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Logs in a user
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - Email
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} - Response data
 */
export const loginUser = async ({ email, password }) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include' // Important for cookies
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logs out the current user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Checks if user is authenticated by verifying the token
 * @returns {Promise<Object>} - User data if authenticated
 */
export const checkAuth = async () => {
  try {
    const response = await fetch('/api/auth/check', {
      credentials: 'include'
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Not authenticated');
    }

    return data;
  } catch (error) {
    console.error('Auth check error:', error);
    throw error;
  }
};