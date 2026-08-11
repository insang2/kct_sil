-- Admin policies for insang2@gmail.com
-- Admin can view ALL profiles
CREATE POLICY "admin_select_profiles" ON profiles
  FOR SELECT
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'insang2@gmail.com'
  );

-- Admin can update any profile (tier changes, verification)
CREATE POLICY "admin_update_profiles" ON profiles
  FOR UPDATE
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'insang2@gmail.com'
  );

-- Admin can view ALL quotes
CREATE POLICY "admin_select_quotes" ON quotes
  FOR SELECT
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'insang2@gmail.com'
  );

-- Enable RLS on products and add policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Anyone (even anonymous) can read active products
CREATE POLICY "public_read_products" ON products
  FOR SELECT USING (is_active = true);

-- Admin can do full CRUD on products
CREATE POLICY "admin_all_products" ON products
  FOR ALL
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'insang2@gmail.com'
  )
  WITH CHECK (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'insang2@gmail.com'
  );
