const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export const authService = {
  isAuthenticated: () => {
    return localStorage.getItem('bloggetway_auth') === 'true';
  },

  login: (password: string) => {
    // Check if currently locked out
    const { isLocked } = authService.getLockoutStatus();
    if (isLocked) return false;

    // Hardcoded mock password for demo purposes
    if (password === 'admin123') {
      localStorage.setItem('bloggetway_auth', 'true');
      authService.resetAttempts(); // Reset counter on success
      return true;
    }
    
    // Record failure
    authService.recordFailedAttempt();
    return false;
  },

  logout: () => {
    localStorage.removeItem('bloggetway_auth');
  },

  // Security Methods
  getLockoutStatus: () => {
    const timestamp = localStorage.getItem('auth_lockout_time');
    if (timestamp) {
      const remaining = parseInt(timestamp) + LOCKOUT_DURATION - Date.now();
      if (remaining > 0) {
        return { isLocked: true, remaining };
      }
      // Lockout expired, clear it
      localStorage.removeItem('auth_lockout_time');
      localStorage.removeItem('auth_failed_attempts');
    }
    return { isLocked: false, remaining: 0 };
  },

  recordFailedAttempt: () => {
    let attempts = parseInt(localStorage.getItem('auth_failed_attempts') || '0');
    attempts++;
    localStorage.setItem('auth_failed_attempts', attempts.toString());
    
    if (attempts >= MAX_ATTEMPTS) {
      localStorage.setItem('auth_lockout_time', Date.now().toString());
    }
    return attempts;
  },

  getFailedAttempts: () => {
    return parseInt(localStorage.getItem('auth_failed_attempts') || '0');
  },

  resetAttempts: () => {
    localStorage.removeItem('auth_failed_attempts');
    localStorage.removeItem('auth_lockout_time');
  }
};