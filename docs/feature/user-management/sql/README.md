# User Profile Management SQL Scripts

This directory contains SQL scripts for managing user profiles in the application. The scripts are organized in the following order:

## Scripts Overview

1. `01_create_profiles.sql`
   - Creates the main profiles table and related tables
   - Sets up Row Level Security (RLS) policies
   - Creates necessary indexes
   - Implements triggers for updated_at timestamps

2. `02_create_functions.sql`
   - Creates helper functions for profile management
   - Includes functions for:
     - Profile creation and settings
     - Following/unfollowing profiles
     - Activity recording
     - Profile statistics
     - Profile feed
     - Profile search

3. `03_create_triggers.sql`
   - Implements database triggers for:
     - Automatic profile settings creation
     - Username validation
     - Self-following prevention
     - Profile update recording
     - Follower change recording
     - Profile data cleanup

## Tables

### profiles
- Main table for user profiles
- Contains basic profile information
- Links to auth.users table

### profile_settings
- Stores profile-specific settings
- Controls privacy and notification preferences
- One-to-one relationship with profiles

### profile_followers
- Manages following relationships between profiles
- Prevents self-following
- Records follower changes

### profile_activity
- Tracks profile-related activities
- Records updates, follows, and other actions
- Supports activity feed generation

## Security

All tables have Row Level Security (RLS) enabled with appropriate policies:
- Users can only view public profiles
- Users can only modify their own profiles
- Following is controlled by profile settings
- Activity visibility is based on profile privacy

## Usage

To apply these scripts:

1. Run the scripts in order:
   ```bash
   psql -d your_database -f 01_create_profiles.sql
   psql -d your_database -f 02_create_functions.sql
   psql -d your_database -f 03_create_triggers.sql
   ```

2. Verify the installation:
   ```sql
   -- Check if tables were created
   \dt profiles profile_settings profile_followers profile_activity

   -- Check if functions were created
   \df create_profile_with_settings
   \df update_profile_settings
   \df follow_profile
   \df unfollow_profile
   \df record_profile_activity
   \df get_profile_stats
   \df get_profile_feed
   \df search_profiles

   -- Check if triggers were created
   \dft create_profile_settings
   \dft validate_username
   \dft prevent_self_following
   \dft record_profile_update
   \dft record_follower_change
   \dft cleanup_profile_data
   ```

## Dependencies

- PostgreSQL 12 or higher
- UUID extension
- Supabase Auth (for auth.users table) 