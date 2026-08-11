-- Add product detail fields for SEO product pages
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS category text DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_ko text DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_en text DEFAULT '',
  ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS applications jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS specifications jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tds_url text,
  ADD COLUMN IF NOT EXISTS image_url text;

-- Auto-generate slugs for existing products (brand + sku, lowercase, spaces→dashes)
UPDATE products
SET slug = LOWER(brand) || '-' || LOWER(REGEXP_REPLACE(sku, '[^a-zA-Z0-9]', '-', 'g'))
WHERE slug IS NULL AND sku IS NOT NULL;

UPDATE products
SET slug = LOWER(REGEXP_REPLACE(name_ko, '[^a-zA-Z0-9]', '-', 'g'))
WHERE slug IS NULL;

-- Ensure slug uniqueness
ALTER TABLE products ADD CONSTRAINT products_slug_unique UNIQUE (slug);

-- Allow public to read slug/detail fields (extends existing public read policy)
-- (The existing "Public read active products" policy already covers all columns)
