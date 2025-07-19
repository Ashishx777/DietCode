export const STORAGE_KEYS = {
  // Stores the final user profile object (after onboarding)
  USER_PROFILE: 'userProfile',

  // Email of the currently logged-in user
  LOGGED_IN_EMAIL: 'loggedInEmail',

  // Prefix for storing auth password (e.g., 'auth-email@example.com')
  AUTH_PREFIX: 'auth-',

  // Prefix for storing user profile by email (e.g., 'profile-email@example.com')
  PROFILE_PREFIX: 'profile-',

  // Stored after signup, used to hydrate ProfileContext
  PROFILE_DATA: 'profileData',

  // Temporary/in-progress data collected during onboarding
  USER_DATA: 'userData',
};
