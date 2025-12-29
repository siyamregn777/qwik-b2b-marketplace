import { UserManager, WebStorageStateStore, User } from 'oidc-client-ts';

// Get environment variables with fallbacks
const getEnv = (key: string, fallback: string = ''): string => {
  if (typeof window !== 'undefined') {
    // For client-side
    const envVar = (import.meta as any).env?.[key];
    return envVar || fallback;
  }
  return fallback;
};

// Configuration for Zitadel OIDC
const zitadelConfig = {
  authority: getEnv('VITE_PUBLIC_ZITADEL_ISSUER', 'https://mile-gegjq7.us1.zitadel.cloud'),
  client_id: getEnv('VITE_PUBLIC_ZITADEL_CLIENT_ID', '353184262020781449'),
  redirect_uri: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '',
  response_type: 'code',
  scope: 'openid profile email',
  post_logout_redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
  userStore: typeof window !== 'undefined' 
    ? new WebStorageStateStore({ store: window.localStorage })
    : undefined,
  automaticSilentRenew: true,
  filterProtocolClaims: true,
  loadUserInfo: true,
  monitorSession: true,
};

// Create UserManager instance (only on client-side)
let userManager: UserManager | null = null;

if (typeof window !== 'undefined') {
  userManager = new UserManager(zitadelConfig);
}

// Type for user profile
export interface UserProfile {
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  middle_name?: string;
  nickname?: string;
  preferred_username?: string;
  profile?: string;
  picture?: string;
  website?: string;
  email?: string;
  email_verified?: boolean;
  gender?: string;
  birthdate?: string;
  zoneinfo?: string;
  locale?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  address?: any;
  updated_at?: number;
}

// Auth functions
export const login = (): Promise<void> => {
  if (!userManager) {
    throw new Error('UserManager not initialized');
  }
  return userManager.signinRedirect();
};

export const logout = (): Promise<void> => {
  if (!userManager) {
    throw new Error('UserManager not initialized');
  }
  return userManager.signoutRedirect();
};

export const getUser = async (): Promise<User | null> => {
  if (!userManager) {
    return null;
  }
  try {
    return await userManager.getUser();
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getUser();
  return !!user && !user.expired;
};

export const getAccessToken = async (): Promise<string | undefined> => {
  const user = await getUser();
  return user?.access_token;
};

export const handleCallback = async (): Promise<User | null> => {
  if (!userManager) {
    throw new Error('UserManager not initialized');
  }
  try {
    const user = await userManager.signinCallback();
    return user || null;
  } catch (error) {
    console.error('Error handling callback:', error);
    return null;
  }
};

export const getProfile = async (): Promise<UserProfile | null> => {
  const user = await getUser();
  return user?.profile || null;
};

// Helper to check if we're in a callback (for the auth/callback route)
export const isSigninCallback = (): boolean => {
  return typeof window !== 'undefined' && 
    window.location.pathname.includes('/auth/callback');
};