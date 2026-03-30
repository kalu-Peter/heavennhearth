-- ============================================================
-- HeavenNhearth Real Estate – Supabase Database Schema
-- ============================================================
-- Run this in the Supabase SQL Editor (in order).

-- 0. Extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- 1. PROFILES (admin users – extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT NOT NULL,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'admin'
                CHECK (role IN ('admin', 'super_admin')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);


-- 2. PROPERTIES
-- ============================================================
CREATE TABLE IF NOT EXISTS properties (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title          TEXT NOT NULL,
  description    TEXT,

  -- Core classification
  listing_type   TEXT NOT NULL
                   CHECK (listing_type IN ('buy', 'rent')),
  property_type  TEXT NOT NULL
                   CHECK (property_type IN (
                     'land', 'house', 'apartment',
                     'farm', 'commercial', 'villa'
                   )),

  -- Pricing
  price          NUMERIC NOT NULL,
  price_period   TEXT
                   CHECK (price_period IN ('monthly', 'yearly')),
                   -- NULL for buy listings

  -- Size
  area_value     NUMERIC,
  area_unit      TEXT DEFAULT 'sqm'
                   CHECK (area_unit IN ('sqm', 'acres', 'hectares', 'ft²')),

  -- House-specific
  bedrooms       INTEGER,
  bathrooms      INTEGER,

  -- Location
  location       TEXT NOT NULL,
  county         TEXT,
  latitude       NUMERIC,
  longitude      NUMERIC,

  -- Display
  badge          TEXT
                   CHECK (badge IN (
                     'Hot Deal', 'New', 'Featured',
                     'For Sale', 'For Rent'
                   )),
  featured       BOOLEAN DEFAULT FALSE,

  -- Status
  status         TEXT NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active', 'sold', 'rented', 'draft')),

  -- Audit
  created_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);


-- 3. PROPERTY IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS property_images (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id   UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  url           TEXT NOT NULL,          -- public URL from storage
  storage_path  TEXT,                   -- path in the bucket (for deletion)
  is_primary    BOOLEAN DEFAULT FALSE,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);


-- 4. PROPERTY FEATURES / AMENITIES
-- ============================================================
CREATE TABLE IF NOT EXISTS property_features (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id  UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  feature      TEXT NOT NULL
);


-- 5. INQUIRIES / LEADS
-- ============================================================
CREATE TABLE IF NOT EXISTS inquiries (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id  UUID REFERENCES properties(id) ON DELETE SET NULL,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  message      TEXT,
  status       TEXT NOT NULL DEFAULT 'new'
                 CHECK (status IN ('new', 'contacted', 'closed')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties        ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images   ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries         ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "Admins can view profiles"
  ON profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- properties – public read (active only), admin full write
CREATE POLICY "Public can view active properties"
  ON properties FOR SELECT
  USING (status = 'active' OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update properties"
  ON properties FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete properties"
  ON properties FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- property_images
CREATE POLICY "Public can view property images"
  ON property_images FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage property images"
  ON property_images FOR ALL
  USING (auth.uid() IS NOT NULL);

-- property_features
CREATE POLICY "Public can view property features"
  ON property_features FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage property features"
  ON property_features FOR ALL
  USING (auth.uid() IS NOT NULL);

-- inquiries
CREATE POLICY "Anyone can submit an inquiry"
  ON inquiries FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admins can view inquiries"
  ON inquiries FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update inquiry status"
  ON inquiries FOR UPDATE
  USING (auth.uid() IS NOT NULL);


-- ============================================================
-- STORAGE BUCKET  (property images)
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', TRUE)
ON CONFLICT DO NOTHING;

CREATE POLICY "Public can view property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

CREATE POLICY "Admins can upload property images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update property images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'property-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete property images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'property-images' AND auth.uid() IS NOT NULL);


-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile row when a new auth user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'admin'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- HELPFUL VIEWS
-- ============================================================

-- Properties with their primary image and feature count
CREATE OR REPLACE VIEW properties_summary AS
SELECT
  p.*,
  pi.url          AS primary_image,
  COUNT(DISTINCT pf.id) AS feature_count
FROM properties p
LEFT JOIN property_images pi
  ON pi.property_id = p.id AND pi.is_primary = TRUE
LEFT JOIN property_features pf
  ON pf.property_id = p.id
GROUP BY p.id, pi.url;
