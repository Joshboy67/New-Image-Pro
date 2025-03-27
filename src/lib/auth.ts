import { createClient } from '@supabase/supabase-js';
import { User } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export class AuthService {
  private static instance: AuthService;
  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signUp(email: string, password: string, fullName: string) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) throw authError;

    // Create profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          full_name: fullName,
        });

      if (profileError) throw profileError;
    }

    return authData;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
    return data;
  }

  async handleGoogleSignIn(user: User) {
    try {
      const googleAvatarUrl = user.user_metadata?.avatar_url;
      
      if (googleAvatarUrl) {
        // Create or update profile with Google data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            google_avatar_url: googleAvatarUrl,
            full_name: user.user_metadata?.full_name,
            email: user.email,
            avatar_url: googleAvatarUrl, // Use Google avatar as default
          })
          .select()
          .single();

        if (profileError) throw profileError;

        // Download and store Google avatar
        await this.downloadAndStoreGoogleAvatar(user.id, googleAvatarUrl);
      }

      return user;
    } catch (error) {
      console.error('Error handling Google sign-in:', error);
      throw error;
    }
  }

  private async downloadAndStoreGoogleAvatar(userId: string, googleAvatarUrl: string) {
    try {
      // Download the avatar from Google
      const response = await fetch(googleAvatarUrl);
      if (!response.ok) throw new Error('Failed to download Google avatar');
      
      const blob = await response.blob();
      const fileExt = 'png';
      const filePath = `${userId}/avatar.${fileExt}`;
      
      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, {
          contentType: 'image/png',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicURL } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicURL.publicUrl })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      return publicURL.publicUrl;
    } catch (error) {
      console.error('Error processing Google avatar:', error);
      return null;
    }
  }

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
  }

  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw error;
    if (!user) return null;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) throw profileError;

    return {
      id: user.id,
      email: user.email!,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      created_at: user.created_at,
      updated_at: profile.updated_at,
    };
  }

  async updateProfile(data: Partial<User>) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    const { error: profileError } = await supabase
      .from('profiles')
      .update(data)
      .eq('user_id', user.id);

    if (profileError) throw profileError;
  }

  async deleteAccount() {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    // Delete profile and related data
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) throw deleteError;

    // Delete user account
    const { error: accountError } = await supabase.auth.admin.deleteUser(user.id);
    if (accountError) throw accountError;
  }

  // OAuth methods
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  // Subscribe to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = AuthService.getInstance(); 