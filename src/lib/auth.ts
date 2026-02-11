/**
 * Authentication Utilities
 *
 * Helper functions for authentication operations with Supabase.
 * Provides signup, signin, signout, and OAuth functions.
 */

import { createClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";

/**
 * Auth response type
 */
export type AuthResponse = {
  success: boolean;
  error?: string;
  message?: string;
  userId?: string;
};

/**
 * Email signup credentials
 */
export type EmailCredentials = {
  email: string;
  password: string;
  fullName?: string;
};

/**
 * Sign up a new user with email and password
 *
 * @param credentials - Email and password credentials
 * @returns Promise with auth response
 */
export async function signUp(credentials: EmailCredentials): Promise<AuthResponse> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        data: {
          full_name: credentials.fullName || "",
        },
      },
    });

    if (error) {
      console.error("Signup error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: "Failed to create user. Please try again.",
      };
    }

    return {
      success: true,
      message: "Account created successfully! Please check your email to verify your account.",
      userId: data.user.id,
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Sign in with email and password
 *
 * @param credentials - Email and password credentials
 * @returns Promise with auth response
 */
export async function signIn(credentials: EmailCredentials): Promise<AuthResponse> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      console.error("Signin error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Signed in successfully!",
      userId: data.user.id,
    };
  } catch (error) {
    console.error("Signin error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Sign out the current user
 *
 * @returns Promise with auth response
 */
export async function signOut(): Promise<AuthResponse> {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Signout error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Signed out successfully!",
    };
  } catch (error) {
    console.error("Signout error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Sign in with Google OAuth
 *
 * @returns Promise with auth response
 */
export async function signInWithGoogle(): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("Google OAuth error:", error.message);
    throw error;
  }
}

/**
 * Reset password - send reset email
 *
 * @param email - User email address
 * @returns Promise with auth response
 */
export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/confirm`,
    });

    if (error) {
      console.error("Reset password error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Password reset email sent! Please check your inbox.",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Update user password
 *
 * @param newPassword - New password
 * @returns Promise with auth response
 */
export async function updatePassword(newPassword: string): Promise<AuthResponse> {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Update password error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Password updated successfully!",
    };
  } catch (error) {
    console.error("Update password error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Get current user session (server-side)
 *
 * @returns Promise with user session or null
 */
export async function getSession() {
  try {
    const supabase = await createServerClient();

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Get session error:", error.message);
      return null;
    }

    return session;
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
}

/**
 * Get current user (server-side)
 *
 * @returns Promise with user or null
 */
export async function getUser() {
  try {
    const supabase = await createServerClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Get user error:", error.message);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}

/**
 * Check if user is authenticated (server-side)
 *
 * @returns Promise with boolean
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

/**
 * Get user profile from database
 *
 * @param userId - User ID
 * @returns Promise with profile data or null
 */
export async function getUserProfile(userId: string) {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Get profile error:", error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
  }
}
