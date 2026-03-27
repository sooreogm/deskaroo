import { requestJson } from '@/lib/http';
import { User } from '@/types';

const CURRENT_AUTH_STORAGE_KEY = 'deskaroo-current-auth-user';
const CURRENT_PROFILE_STORAGE_KEY = 'deskaroo-current-user-profile';
const CURRENT_SESSION_STORAGE_KEY = 'deskaroo-current-session';
const LEGACY_CURRENT_USER_STORAGE_KEY = 'deskaroo-current-user-id';
const PASSWORD_RESET_STORAGE_KEY = 'deskaroo-password-reset-email';
const SESSION_REFRESH_BUFFER_MS = 60 * 1000;

type UserRole = NonNullable<User['role']>;

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  user_metadata: {
    name: string;
  };
}

export interface AuthSession {
  access_token: string;
  token_type: 'Bearer';
  expires_at: string;
  refresh_expires_at: string;
}

interface StoredUser extends User {
  role: UserRole;
  avatarUrl?: string;
}

interface AuthResponse {
  user: AuthUser;
  profile: User;
  session: AuthSession;
}

interface SignUpResponse {
  user: User;
  email: string;
  verificationRequired: boolean;
  verificationEmailSent: boolean;
}

interface VerificationEmailResponse {
  success: true;
  message: string;
}

interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  avatar_url?: string;
}

const syncStoredProfile = (userId: string, profile: UserProfile) => {
  const existingUser = getPublicUserById(userId);

  if (existingUser) {
    upsertKnownUser({
      ...existingUser,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      department: profile.department,
      avatar: profile.avatar_url,
    });
  }

  if (currentProfile?.id === userId) {
    const nextProfile: User = {
      ...currentProfile,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      department: profile.department,
      avatar: profile.avatar_url,
    };

    const nextAuthUser = currentAuthUser
      ? {
          ...currentAuthUser,
          email: profile.email,
          user_metadata: {
            name: profile.name,
          },
        }
      : null;

    persistCurrentSession(nextAuthUser, nextProfile);
  }
};

const users: StoredUser[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+44 7700 900001',
    department: 'Engineering',
    role: 'user',
    teamId: 'team-1',
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+44 7700 900002',
    department: 'Operations',
    role: 'admin',
    teamId: 'team-2',
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    department: 'Engineering',
    role: 'user',
    teamId: 'team-1',
  },
  {
    id: 'user-3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    department: 'Engineering',
    role: 'user',
    teamId: 'team-1',
  },
  {
    id: 'user-4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    department: 'Design',
    role: 'user',
    teamId: 'team-2',
  },
  {
    id: 'admin-2',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    department: 'Leadership',
    role: 'admin',
    teamId: 'team-2',
  },
];

let currentAuthUser: AuthUser | null = null;
let currentProfile: User | null = null;
let currentSession: AuthSession | null = null;
let pendingPasswordResetEmail: string | null = null;
let hydrated = false;
let refreshSessionPromise: Promise<{ user: AuthUser | null; error: Error | null }> | null = null;

const isBrowser = () => typeof window !== 'undefined';

const safeParse = <T>(value: string | null): T | null => {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const toStoredUser = (user: User): StoredUser => ({
  ...user,
  role: user.role ?? 'user',
  avatarUrl: user.avatar,
});

const toPublicUser = (user: StoredUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatarUrl,
  phone: user.phone,
  department: user.department,
  role: user.role,
  teamId: user.teamId,
});

const toAuthUser = (user: StoredUser): AuthUser => ({
  id: user.id,
  email: user.email,
  role: user.role,
  user_metadata: {
    name: user.name,
  },
});

const getStoredUserById = (id: string): StoredUser | undefined => {
  return users.find((user) => user.id === id);
};

const getPublicUserById = (id: string) => {
  const user = getStoredUserById(id);
  return user ? toPublicUser(user) : undefined;
};

const persistCurrentSession = (
  authUser: AuthUser | null,
  profile: User | null,
  session: AuthSession | null = authUser ? currentSession : null
) => {
  currentAuthUser = authUser;
  currentProfile = profile;
  currentSession = authUser ? session : null;
  hydrated = true;

  if (!isBrowser()) return;

  if (authUser) {
    window.localStorage.setItem(CURRENT_AUTH_STORAGE_KEY, JSON.stringify(authUser));
    window.localStorage.setItem(LEGACY_CURRENT_USER_STORAGE_KEY, authUser.id);
  } else {
    window.localStorage.removeItem(CURRENT_AUTH_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_CURRENT_USER_STORAGE_KEY);
  }

  if (profile) {
    window.localStorage.setItem(CURRENT_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } else {
    window.localStorage.removeItem(CURRENT_PROFILE_STORAGE_KEY);
  }

  if (currentSession) {
    window.localStorage.setItem(CURRENT_SESSION_STORAGE_KEY, JSON.stringify(currentSession));
  } else {
    window.localStorage.removeItem(CURRENT_SESSION_STORAGE_KEY);
  }
};

const persistPasswordResetEmail = (email: string | null) => {
  pendingPasswordResetEmail = email;
  hydrated = true;

  if (!isBrowser()) return;

  if (email) {
    window.localStorage.setItem(PASSWORD_RESET_STORAGE_KEY, email);
  } else {
    window.localStorage.removeItem(PASSWORD_RESET_STORAGE_KEY);
  }
};

const hydrateFromStorage = () => {
  if (hydrated || !isBrowser()) return;

  currentAuthUser = safeParse<AuthUser>(window.localStorage.getItem(CURRENT_AUTH_STORAGE_KEY));
  currentProfile = safeParse<User>(window.localStorage.getItem(CURRENT_PROFILE_STORAGE_KEY));
  currentSession = safeParse<AuthSession>(window.localStorage.getItem(CURRENT_SESSION_STORAGE_KEY));

  if (!currentProfile && currentAuthUser) {
    currentProfile = {
      id: currentAuthUser.id,
      name: currentAuthUser.user_metadata.name,
      email: currentAuthUser.email,
      role: currentAuthUser.role,
    };
  }

  if (!currentAuthUser) {
    const legacyUserId = window.localStorage.getItem(LEGACY_CURRENT_USER_STORAGE_KEY);
    const legacyUser = legacyUserId ? getStoredUserById(legacyUserId) : undefined;

    if (legacyUser) {
      currentAuthUser = toAuthUser(legacyUser);
      currentProfile = toPublicUser(legacyUser);
      persistCurrentSession(currentAuthUser, currentProfile);
    }
  }

  pendingPasswordResetEmail = window.localStorage.getItem(PASSWORD_RESET_STORAGE_KEY);
  hydrated = true;
};

const upsertKnownUser = (user: User) => {
  const index = users.findIndex((candidate) => candidate.id === user.id);
  const nextUser = toStoredUser(user);

  if (index === -1) {
    users.push(nextUser);
    return;
  }

  users[index] = {
    ...users[index],
    ...nextUser,
    avatarUrl: user.avatar,
    role: user.role ?? users[index].role,
  };
};

const hasFreshSession = (session: AuthSession | null, bufferMs = SESSION_REFRESH_BUFFER_MS) => {
  if (!session?.access_token || !session.expires_at) {
    return false;
  }

  const expiresAt = Date.parse(session.expires_at);
  if (Number.isNaN(expiresAt)) {
    return false;
  }

  return expiresAt - Date.now() > bufferMs;
};

const applyAuthResponse = (data: AuthResponse) => {
  const profile = {
    ...data.profile,
    avatar: data.profile.avatar ?? undefined,
    role: data.profile.role ?? data.user.role,
  };

  upsertKnownUser(profile);
  persistCurrentSession(data.user, profile, data.session);
  return profile;
};

const getKnownUsers = (): User[] => {
  const knownUsers = users.map(toPublicUser);

  if (!currentProfile) {
    return knownUsers;
  }

  const index = knownUsers.findIndex((user) => user.id === currentProfile?.id);
  if (index === -1) {
    return [currentProfile, ...knownUsers];
  }

  const nextUsers = [...knownUsers];
  nextUsers[index] = {
    ...nextUsers[index],
    ...currentProfile,
  };
  return nextUsers;
};

export const getCurrentAuthUser = (): AuthUser | null => {
  hydrateFromStorage();
  return currentAuthUser;
};

export const getCurrentAuthSession = (): AuthSession | null => {
  hydrateFromStorage();
  return currentSession;
};

export const getCurrentUser = (): User => {
  hydrateFromStorage();
  return currentProfile ?? getKnownUsers()[0];
};

export const isAdmin = (): boolean => {
  const user = getCurrentAuthUser();
  return user?.role === 'admin';
};

export const getUserById = (id: string): User | undefined => {
  hydrateFromStorage();
  return getKnownUsers().find((user) => user.id === id);
};

export const getAllUsers = (): User[] => {
  hydrateFromStorage();
  return getKnownUsers();
};

export const getUserTeamMembers = (userId: string): User[] => {
  hydrateFromStorage();

  const user = getUserById(userId);
  if (!user?.teamId) return [];

  return getKnownUsers().filter((candidate) => candidate.teamId === user.teamId && candidate.id !== userId);
};

export const getCurrentUserTeamMembers = (): User[] => {
  const currentUser = getCurrentUser();
  return getUserTeamMembers(currentUser.id);
};

export const updateUser = (user: Partial<User> & { id: string }): User => {
  const index = users.findIndex((existingUser) => existingUser.id === user.id);

  if (index !== -1) {
    users[index] = {
      ...users[index],
      ...user,
      avatarUrl: user.avatar ?? users[index].avatarUrl,
      role: user.role ?? users[index].role,
    };

    const updatedUser = toPublicUser(users[index]);
    if (currentProfile?.id === updatedUser.id) {
      const nextAuthUser = currentAuthUser
        ? {
            ...currentAuthUser,
            email: updatedUser.email,
            role: updatedUser.role ?? currentAuthUser.role,
            user_metadata: {
              name: updatedUser.name,
            },
          }
        : null;

      persistCurrentSession(nextAuthUser, updatedUser);
    }

    return updatedUser;
  }

  const newUser: StoredUser = {
    id: user.id,
    name: user.name || 'New User',
    email: user.email || 'user@example.com',
    phone: user.phone,
    department: user.department,
    avatarUrl: user.avatar,
    role: user.role || 'user',
    teamId: user.teamId,
  };
  users.push(newUser);
  return toPublicUser(newUser);
};

export const signInUser = async (email: string, password: string): Promise<{ user: AuthUser | null; error: Error | null }> => {
  try {
    const data = await requestJson<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      credentials: 'same-origin',
    });
    applyAuthResponse(data);
    return { user: data.user, error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Invalid email or password'),
    };
  }
};

export const signUpUser = async (
  email: string,
  password: string,
  name: string
): Promise<{
  user: User | null;
  email: string | null;
  verificationRequired: boolean;
  verificationEmailSent: boolean;
  error: Error | null;
}> => {
  try {
    const data = await requestJson<SignUpResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    upsertKnownUser(data.user);
    return {
      user: data.user,
      email: data.email,
      verificationRequired: data.verificationRequired,
      verificationEmailSent: data.verificationEmailSent,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      email: null,
      verificationRequired: false,
      verificationEmailSent: false,
      error: error instanceof Error ? error : new Error('Unable to sign up'),
    };
  }
};

export const resendEmailVerification = async (
  email: string
): Promise<{ message: string | null; error: Error | null }> => {
  try {
    const data = await requestJson<VerificationEmailResponse>('/api/auth/email-verification/resend', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    return {
      message: data.message,
      error: null,
    };
  } catch (error) {
    return {
      message: null,
      error: error instanceof Error ? error : new Error('Unable to resend verification email'),
    };
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await requestJson<{ success: true }>('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
    });
  } finally {
    persistCurrentSession(null, null, null);
  }
};

export const refreshAuthSession = async (): Promise<{ user: AuthUser | null; error: Error | null }> => {
  if (refreshSessionPromise) {
    return refreshSessionPromise;
  }

  refreshSessionPromise = (async () => {
    try {
      const data = await requestJson<AuthResponse>('/api/auth/refresh', {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
      });

      applyAuthResponse(data);
      return { user: data.user, error: null };
    } catch (error) {
      persistCurrentSession(null, null, null);
      return {
        user: null,
        error: error instanceof Error ? error : new Error('Unable to refresh session'),
      };
    } finally {
      refreshSessionPromise = null;
    }
  })();

  return refreshSessionPromise;
};

export const restoreAuthSession = async (): Promise<{ user: AuthUser | null; error: Error | null }> => {
  hydrateFromStorage();

  if (currentAuthUser && currentSession && hasFreshSession(currentSession, 0)) {
    return { user: currentAuthUser, error: null };
  }

  return refreshAuthSession();
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    return await requestJson<UserProfile>(`/api/users/${userId}/profile`);
  } catch {
    return null;
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: { name?: string; phone?: string; department?: string; avatar_url?: string }
): Promise<UserProfile | null> => {
  try {
    const profile = await requestJson<UserProfile>(`/api/users/${userId}/profile`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });

    syncStoredProfile(userId, profile);

    return profile;
  } catch {
    return null;
  }
};

export const uploadUserAvatar = async (userId: string, file: File): Promise<string> => {
  const { user, error } = await restoreAuthSession();
  const session = getCurrentAuthSession();

  if (!user || user.id !== userId || !session?.access_token) {
    throw error ?? new Error('Not authenticated');
  }

  const formData = new FormData();
  formData.append('file', file);

  const profile = await requestJson<UserProfile>(`/api/users/${userId}/profile/avatar`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  syncStoredProfile(userId, profile);

  return profile.avatar_url ?? '';
};

export const updateCurrentUserPassword = async (password: string): Promise<{ error: Error | null }> => {
  const authUser = getCurrentAuthUser();
  if (!authUser) {
    return { error: new Error('Not authenticated') };
  }

  try {
    await requestJson<{ success: true }>(`/api/users/${authUser.id}/password`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error : new Error('Unable to update password') };
  }
};

export const requestPasswordReset = async (email: string): Promise<{ error: Error | null }> => {
  try {
    await requestJson<{ success: true }>('/api/auth/password-reset/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    persistPasswordResetEmail(email);
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error : new Error('Unable to request password reset') };
  }
};

export const hasPendingPasswordReset = (): boolean => {
  hydrateFromStorage();
  return !!pendingPasswordResetEmail;
};

export const completePasswordReset = async (password: string): Promise<{ error: Error | null }> => {
  hydrateFromStorage();

  if (!pendingPasswordResetEmail) {
    return { error: new Error('No password reset request found') };
  }

  try {
    await requestJson<{ success: true }>('/api/auth/password-reset/complete', {
      method: 'POST',
      body: JSON.stringify({ email: pendingPasswordResetEmail, password }),
    });

    persistPasswordResetEmail(null);
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error : new Error('Unable to complete password reset') };
  }
};
