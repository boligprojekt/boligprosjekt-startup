-- BoligProsjekt Database Schema
-- Kjør dette i Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabell for prosjekter
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabell for produkter i database
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    store VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    icon VARCHAR(10),
    description TEXT,
    product_url TEXT,
    quality_level VARCHAR(20) DEFAULT 'standard', -- 'budsjett', 'standard', 'premium'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabell for handleliste items
CREATE TABLE IF NOT EXISTS shopping_list_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabell for bruker profiler (ekstra info utover auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name VARCHAR(255),
    full_name VARCHAR(255),
    phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabell for brukerbilder
CREATE TABLE IF NOT EXISTS user_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    public_url TEXT NOT NULL,
    image_type VARCHAR(50) DEFAULT 'avatar', -- 'avatar', 'project', 'other'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for bedre ytelse
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_shopping_list_project_id ON shopping_list_items(project_id);
CREATE INDEX IF NOT EXISTS idx_user_images_user_id ON user_images(user_id);
CREATE INDEX IF NOT EXISTS idx_user_images_type ON user_images(image_type);

-- Row Level Security (RLS) policies

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_images ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view their own projects"
    ON projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
    ON projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
    ON projects FOR DELETE
    USING (auth.uid() = user_id);

-- Shopping list policies
CREATE POLICY "Users can view their own shopping list items"
    ON shopping_list_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = shopping_list_items.project_id
        AND projects.user_id = auth.uid()
    ));

CREATE POLICY "Users can create shopping list items for their projects"
    ON shopping_list_items FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = shopping_list_items.project_id
        AND projects.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their own shopping list items"
    ON shopping_list_items FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = shopping_list_items.project_id
        AND projects.user_id = auth.uid()
    ));

-- User profiles policies
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- User images policies
CREATE POLICY "Users can view their own images"
    ON user_images FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own images"
    ON user_images FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own images"
    ON user_images FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images"
    ON user_images FOR DELETE
    USING (auth.uid() = user_id);

-- Products table is public (everyone can read)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view products"
    ON products FOR SELECT
    TO public
    USING (true);

-- Projects table - allow anonymous users to read for popular projects
CREATE POLICY "Anyone can view project categories and budgets"
    ON projects FOR SELECT
    TO public
    USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_images_updated_at
    BEFORE UPDATE ON user_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO products (name, category, store, price, icon, description) VALUES
-- Kjøkken
('IKEA KNOXHULT Kjøkken', 'kjokken', 'IKEA', 15000, '🏠', 'Komplett kjøkkenløsning'),
('Benkeplate eik 3m', 'kjokken', 'Byggmakker', 3500, '🪵', 'Massiv eik benkeplate'),
('Kjøkkenvask rustfritt stål', 'kjokken', 'Biltema', 1200, '🚰', 'Dobbel vask i rustfritt stål'),
('Kjøkkenkran krom', 'kjokken', 'Biltema', 800, '🚿', 'Moderne kjøkkenkran'),
('LED-list kjøkken 3m', 'kjokken', 'Jula', 600, '💡', 'LED belysning under skap'),
('Stikkontakter 5-pack', 'kjokken', 'Elektroimportøren', 400, '🔌', 'Moderne stikkontakter'),

-- Bad
('Dusjkabinett 90x90', 'bad', 'Byggmakker', 4500, '🚿', 'Komplett dusjkabinett'),
('Toalett komplett', 'bad', 'IKEA', 2500, '🚽', 'Vegghengt toalett'),
('Servant med skap', 'bad', 'IKEA', 3000, '🪞', 'Servant med underskap'),
('Baderomsflis 10m²', 'bad', 'Byggmakker', 5000, '⬜', 'Moderne baderomsflis'),
('Dusjarmatur termostat', 'bad', 'Biltema', 1500, '🚿', 'Termostat dusjarmatur'),
('Speil med belysning', 'bad', 'IKEA', 1200, '💡', 'LED-speil'),

-- Gulv
('Laminat eik 20m²', 'gulv', 'Byggmakker', 6000, '🪵', 'Laminatgulv eik-dekor'),
('Gulvlist 40m', 'gulv', 'Byggmakker', 1200, '📏', 'Hvit gulvlist'),
('Underlagsmatte 20m²', 'gulv', 'Jula', 800, '📋', 'Lyddemping underlag'),
('Parkett ask 15m²', 'gulv', 'Byggmakker', 9000, '🌳', 'Ekte askeparkett'),
('Gulvlim 5L', 'gulv', 'Biltema', 500, '🧴', 'Profesjonell gulvlim'),

-- Maling
('Veggmaling hvit 10L', 'maling', 'Jula', 800, '🎨', 'Matt veggmaling'),
('Takmaling 10L', 'maling', 'Jula', 700, '🎨', 'Hvit takmaling'),
('Malerruller sett', 'maling', 'Biltema', 300, '🖌️', 'Komplett rullesett'),
('Malerpensler 5-pack', 'maling', 'Biltema', 200, '🖌️', 'Ulike størrelser'),
('Malertape 50m', 'maling', 'Jula', 150, '📦', 'Presisjonstape'),
('Plastduk 4x5m', 'maling', 'Biltema', 100, '📋', 'Beskyttelsesduk'),

-- Belysning
('LED-taklampe moderne', 'belysning', 'IKEA', 800, '💡', 'Moderne taklampe'),
('Spotlights 6-pack', 'belysning', 'Elektroimportøren', 1200, '💡', 'Innfelte spots'),
('Vegglampe 2-pack', 'belysning', 'IKEA', 600, '💡', 'Moderne vegglamper'),
('LED-pærer E27 10-pack', 'belysning', 'Biltema', 400, '💡', 'Energisparende LED'),
('Dimmer smart', 'belysning', 'Elektroimportøren', 500, '🔌', 'Smart dimmer'),

-- Vinduer
('Vindu 3-lags 120x120', 'vinduer', 'Byggmakker', 4500, '🪟', 'Energivindu 3-lags'),
('Vindu 3-lags 100x100', 'vinduer', 'Byggmakker', 3800, '🪟', 'Energivindu 3-lags'),
('Vinduskarm komplett', 'vinduer', 'Byggmakker', 800, '📏', 'Komplett karmsett'),
('Tetningsmasse 10-pack', 'vinduer', 'Biltema', 600, '🧴', 'Silikon tetningsmasse'),
('Vindusbeslag sett', 'vinduer', 'Jula', 400, '🔧', 'Komplett beslagsett')
ON CONFLICT DO NOTHING;

