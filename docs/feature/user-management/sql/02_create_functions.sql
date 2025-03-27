-- Function to create a new profile with default settings
CREATE OR REPLACE FUNCTION create_profile_with_settings(
    p_user_id UUID,
    p_username TEXT,
    p_full_name TEXT
) RETURNS UUID AS $$
DECLARE
    v_profile_id UUID;
BEGIN
    -- Insert profile
    INSERT INTO profiles (user_id, username, full_name)
    VALUES (p_user_id, p_username, p_full_name)
    RETURNING id INTO v_profile_id;

    -- Insert default settings
    INSERT INTO profile_settings (profile_id)
    VALUES (v_profile_id);

    RETURN v_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update profile settings
CREATE OR REPLACE FUNCTION update_profile_settings(
    p_profile_id UUID,
    p_is_public BOOLEAN DEFAULT NULL,
    p_allow_following BOOLEAN DEFAULT NULL,
    p_allow_messaging BOOLEAN DEFAULT NULL,
    p_show_activity BOOLEAN DEFAULT NULL,
    p_notification_preferences JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE profile_settings
    SET
        is_public = COALESCE(p_is_public, is_public),
        allow_following = COALESCE(p_allow_following, allow_following),
        allow_messaging = COALESCE(p_allow_messaging, allow_messaging),
        show_activity = COALESCE(p_show_activity, show_activity),
        notification_preferences = COALESCE(p_notification_preferences, notification_preferences)
    WHERE profile_id = p_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to follow a profile
CREATE OR REPLACE FUNCTION follow_profile(
    p_follower_id UUID,
    p_following_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_can_follow BOOLEAN;
BEGIN
    -- Check if following is allowed
    SELECT allow_following INTO v_can_follow
    FROM profile_settings
    WHERE profile_id = p_following_id;

    IF v_can_follow THEN
        INSERT INTO profile_followers (follower_id, following_id)
        VALUES (p_follower_id, p_following_id)
        ON CONFLICT DO NOTHING;
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to unfollow a profile
CREATE OR REPLACE FUNCTION unfollow_profile(
    p_follower_id UUID,
    p_following_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM profile_followers
    WHERE follower_id = p_follower_id AND following_id = p_following_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record profile activity
CREATE OR REPLACE FUNCTION record_profile_activity(
    p_profile_id UUID,
    p_activity_type TEXT,
    p_activity_data JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    v_activity_id UUID;
BEGIN
    INSERT INTO profile_activity (profile_id, activity_type, activity_data)
    VALUES (p_profile_id, p_activity_type, p_activity_data)
    RETURNING id INTO v_activity_id;
    RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get profile statistics
CREATE OR REPLACE FUNCTION get_profile_stats(p_profile_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'followers_count', (
            SELECT COUNT(*)
            FROM profile_followers
            WHERE following_id = p_profile_id
        ),
        'following_count', (
            SELECT COUNT(*)
            FROM profile_followers
            WHERE follower_id = p_profile_id
        ),
        'activity_count', (
            SELECT COUNT(*)
            FROM profile_activity
            WHERE profile_id = p_profile_id
        )
    ) INTO v_stats;
    RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get profile feed
CREATE OR REPLACE FUNCTION get_profile_feed(
    p_profile_id UUID,
    p_limit INTEGER DEFAULT 10,
    p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
    activity_id UUID,
    activity_type TEXT,
    activity_data JSONB,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pa.id,
        pa.activity_type,
        pa.activity_data,
        pa.created_at
    FROM profile_activity pa
    WHERE pa.profile_id = p_profile_id
    ORDER BY pa.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search profiles
CREATE OR REPLACE FUNCTION search_profiles(
    p_search_term TEXT,
    p_limit INTEGER DEFAULT 10,
    p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
    profile_id UUID,
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.username,
        p.full_name,
        p.avatar_url,
        p.bio
    FROM profiles p
    JOIN profile_settings ps ON p.id = ps.profile_id
    WHERE 
        ps.is_public = true AND
        (
            p.username ILIKE '%' || p_search_term || '%' OR
            p.full_name ILIKE '%' || p_search_term || '%' OR
            p.bio ILIKE '%' || p_search_term || '%'
        )
    ORDER BY 
        CASE 
            WHEN p.username ILIKE p_search_term THEN 1
            WHEN p.full_name ILIKE p_search_term THEN 2
            ELSE 3
        END,
        p.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 