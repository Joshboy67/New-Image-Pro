-- Trigger to automatically create profile settings when a new profile is created
CREATE OR REPLACE FUNCTION create_profile_settings_trigger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profile_settings (profile_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_profile_settings
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION create_profile_settings_trigger();

-- Trigger to validate username format
CREATE OR REPLACE FUNCTION validate_username_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Username must be between 3 and 30 characters
    IF LENGTH(NEW.username) < 3 OR LENGTH(NEW.username) > 30 THEN
        RAISE EXCEPTION 'Username must be between 3 and 30 characters';
    END IF;

    -- Username can only contain letters, numbers, underscores, and hyphens
    IF NOT NEW.username ~ '^[a-zA-Z0-9_-]+$' THEN
        RAISE EXCEPTION 'Username can only contain letters, numbers, underscores, and hyphens';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER validate_username
    BEFORE INSERT OR UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION validate_username_trigger();

-- Trigger to prevent self-following
CREATE OR REPLACE FUNCTION prevent_self_following_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.follower_id = NEW.following_id THEN
        RAISE EXCEPTION 'Cannot follow your own profile';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER prevent_self_following
    BEFORE INSERT ON profile_followers
    FOR EACH ROW
    EXECUTE FUNCTION prevent_self_following_trigger();

-- Trigger to record profile updates
CREATE OR REPLACE FUNCTION record_profile_update_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Only record if there are actual changes
    IF OLD.* IS DISTINCT FROM NEW.* THEN
        INSERT INTO profile_activity (
            profile_id,
            activity_type,
            activity_data
        )
        VALUES (
            NEW.id,
            'profile_update',
            jsonb_build_object(
                'changes', jsonb_build_object(
                    'username', CASE WHEN OLD.username IS DISTINCT FROM NEW.username THEN NEW.username ELSE NULL END,
                    'full_name', CASE WHEN OLD.full_name IS DISTINCT FROM NEW.full_name THEN NEW.full_name ELSE NULL END,
                    'bio', CASE WHEN OLD.bio IS DISTINCT FROM NEW.bio THEN NEW.bio ELSE NULL END,
                    'website', CASE WHEN OLD.website IS DISTINCT FROM NEW.website THEN NEW.website ELSE NULL END,
                    'location', CASE WHEN OLD.location IS DISTINCT FROM NEW.location THEN NEW.location ELSE NULL END
                )
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER record_profile_update
    AFTER UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION record_profile_update_trigger();

-- Trigger to record follower changes
CREATE OR REPLACE FUNCTION record_follower_change_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Record new follower
        INSERT INTO profile_activity (
            profile_id,
            activity_type,
            activity_data
        )
        VALUES (
            NEW.following_id,
            'new_follower',
            jsonb_build_object(
                'follower_id', NEW.follower_id
            )
        );
    ELSIF TG_OP = 'DELETE' THEN
        -- Record unfollow
        INSERT INTO profile_activity (
            profile_id,
            activity_type,
            activity_data
        )
        VALUES (
            OLD.following_id,
            'unfollow',
            jsonb_build_object(
                'follower_id', OLD.follower_id
            )
        );
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER record_follower_change
    AFTER INSERT OR DELETE ON profile_followers
    FOR EACH ROW
    EXECUTE FUNCTION record_follower_change_trigger();

-- Trigger to clean up profile data on deletion
CREATE OR REPLACE FUNCTION cleanup_profile_data_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete profile settings
    DELETE FROM profile_settings WHERE profile_id = OLD.id;

    -- Delete followers
    DELETE FROM profile_followers 
    WHERE follower_id = OLD.id OR following_id = OLD.id;

    -- Delete activity
    DELETE FROM profile_activity WHERE profile_id = OLD.id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER cleanup_profile_data
    BEFORE DELETE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION cleanup_profile_data_trigger(); 