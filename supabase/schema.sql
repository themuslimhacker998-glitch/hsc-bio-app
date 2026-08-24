-- =====================================================================
-- HSC Biology — Supabase Schema
-- Paste this entire file into Supabase SQL Editor and run it.
-- Idempotent: safe to re-run (uses IF NOT EXISTS, CREATE OR REPLACE).
-- =====================================================================

-- -------------------------------------------------------------------
-- 0. Extensions
-- -------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------
-- 1. PROFILES — 1:1 extension of auth.users
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE,
  display_name TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.profiles IS 'Public profile, 1:1 with auth.users';
COMMENT ON COLUMN public.profiles.username IS 'Unique username set during signup';

-- Index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (username);

-- -------------------------------------------------------------------
-- 2. CHAPTER PROGRESS — per-user, per-chapter completion tracking
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chapter_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_slug    TEXT NOT NULL,
  percentage      INTEGER NOT NULL DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
  completed       BOOLEAN NOT NULL GENERATED ALWAYS AS (percentage >= 100) STORED,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, chapter_slug)
);

COMMENT ON TABLE  public.chapter_progress IS 'Per-chapter progress for each user';
COMMENT ON COLUMN public.chapter_progress.percentage IS '0–100 completion percentage';

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_chapter_progress_user ON public.chapter_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_chapter_progress_user_slug ON public.chapter_progress (user_id, chapter_slug);

-- -------------------------------------------------------------------
-- 3. USER PREFERENCES — theme, language, extensible
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme        TEXT NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  language     TEXT NOT NULL DEFAULT 'bn' CHECK (language IN ('bn', 'en')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.user_preferences IS 'Per-user UI preferences (theme, language)';

-- -------------------------------------------------------------------
-- 4. UPDATED_AT TRIGGER FUNCTION — reusable for all tables
-- -------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to profiles
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Apply to chapter_progress
DROP TRIGGER IF EXISTS set_updated_at ON public.chapter_progress;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.chapter_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Apply to user_preferences
DROP TRIGGER IF EXISTS set_updated_at ON public.user_preferences;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- -------------------------------------------------------------------
-- 5. AUTO-CREATE PROFILE ON SIGNUP
--    Inserts into profiles whenever a new auth user is created.
--    Uses user_metadata stored during signUp (full_name, username).
-- -------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create profile trigger (fires on INSERT into auth.users)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- -------------------------------------------------------------------

-- Profiles: users can read all profiles (for display), but only update their own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read profiles (needed for display)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can only update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (fallback for edge cases)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Chapter progress: users can only CRUD their own progress
ALTER TABLE public.chapter_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own progress" ON public.chapter_progress;
CREATE POLICY "Users can view own progress"
  ON public.chapter_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.chapter_progress;
CREATE POLICY "Users can insert own progress"
  ON public.chapter_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.chapter_progress;
CREATE POLICY "Users can update own progress"
  ON public.chapter_progress FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own progress" ON public.chapter_progress;
CREATE POLICY "Users can delete own progress"
  ON public.chapter_progress FOR DELETE
  USING (auth.uid() = user_id);

-- User preferences: users can only CRUD their own preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;
CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- -------------------------------------------------------------------
-- 7. CLEANUP: drop old user_progress table if it exists
--    (The previous implementation used a 'user_progress' table.
--     This migration replaces it with 'chapter_progress'.)
-- -------------------------------------------------------------------
-- Uncomment the line below ONLY if you want to drop the old table:
-- DROP TABLE IF EXISTS public.user_progress;

-- =====================================================================
-- DONE. After running, verify in Supabase Dashboard:
--   1. Table Editor → profiles, chapter_progress, user_preferences exist
--   2. Authentication → Providers → Email: confirm email enabled
--   3. Authentication → URL Configuration: add redirect URLs
-- =====================================================================
