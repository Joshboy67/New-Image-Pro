-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    location TEXT,
    social_links JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create profile settings table
CREATE TABLE profile_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT true,
    allow_following BOOLEAN DEFAULT true,
    allow_messaging BOOLEAN DEFAULT true,
    show_activity BOOLEAN DEFAULT true,
    notification_preferences JSONB DEFAULT '{
        "email": true,
        "push": true,
        "processing_complete": true,
        "processing_failed": true,
        "new_features": false
    }',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create profile followers table
CREATE TABLE profile_followers (
    follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

-- Create profile activity table
CREATE TABLE profile_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_activity ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view public profiles"
    ON profiles FOR SELECT
    USING (
        is_public = true OR
        auth.uid() = user_id
    );

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for profile settings
CREATE POLICY "Users can view their own settings"
    ON profile_settings FOR SELECT
    USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = profile_id));

CREATE POLICY "Users can update their own settings"
    ON profile_settings FOR UPDATE
    USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = profile_id));

CREATE POLICY "Users can insert their own settings"
    ON profile_settings FOR INSERT
    WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = profile_id));

-- Create RLS policies for profile followers
CREATE POLICY "Users can view followers"
    ON profile_followers FOR SELECT
    USING (
        following_id IN (
            SELECT id FROM profiles WHERE is_public = true
        ) OR
        auth.uid() = (SELECT user_id FROM profiles WHERE id = following_id)
    );

CREATE POLICY "Users can follow profiles"
    ON profile_followers FOR INSERT
    WITH CHECK (
        auth.uid() = (SELECT user_id FROM profiles WHERE id = follower_id) AND
        following_id IN (
            SELECT id FROM profiles WHERE is_public = true
        )
    );

CREATE POLICY "Users can unfollow profiles"
    ON profile_followers FOR DELETE
    USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = follower_id));

-- Create RLS policies for profile activity
CREATE POLICY "Users can view public activity"
    ON profile_activity FOR SELECT
    USING (
        profile_id IN (
            SELECT id FROM profiles WHERE is_public = true
        ) OR
        auth.uid() = (SELECT user_id FROM profiles WHERE id = profile_id)
    );

CREATE POLICY "Users can insert their own activity"
    ON profile_activity FOR INSERT
    WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = profile_id));

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profile_settings_updated_at
    BEFORE UPDATE ON profile_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profile_followers_follower_id ON profile_followers(follower_id);
CREATE INDEX idx_profile_followers_following_id ON profile_followers(following_id);
CREATE INDEX idx_profile_activity_profile_id ON profile_activity(profile_id);
CREATE INDEX idx_profile_activity_created_at ON profile_activity(created_at); 