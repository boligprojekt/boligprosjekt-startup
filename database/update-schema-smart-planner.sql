-- BoligProsjekt - Smart Oppussingsplanlegger Database Updates
-- Kjør dette i Supabase SQL Editor

-- 1. OPPDATER PRODUCTS TABELL MED NYE FELTER
ALTER TABLE products ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20) DEFAULT 'low';
ALTER TABLE products ADD COLUMN IF NOT EXISTS diy_friendly BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS recommended_quality VARCHAR(20);
ALTER TABLE products ADD COLUMN IF NOT EXISTS long_term_value INTEGER DEFAULT 3;
ALTER TABLE products ADD COLUMN IF NOT EXISTS common_mistakes TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS expert_tip TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS times_used INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(2,1) DEFAULT 4.0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS warranty_years INTEGER DEFAULT 2;

-- 2. OPPRETT PROJECT_PLANS TABELL
CREATE TABLE IF NOT EXISTS project_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    housing_type VARCHAR(50),
    build_year VARCHAR(50),
    room_type VARCHAR(50),
    room_size DECIMAL(10,2),
    current_condition VARCHAR(20),
    project_scope VARCHAR(20),
    diy_level VARCHAR(20),
    timeline INTEGER,
    quality_level VARCHAR(20) DEFAULT 'standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. OPPRETT PROJECT_STEPS TABELL
CREATE TABLE IF NOT EXISTS project_steps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_plan_id UUID REFERENCES project_plans(id) ON DELETE CASCADE,
    step_number INTEGER,
    title VARCHAR(255),
    description TEXT,
    estimated_cost DECIMAL(10,2),
    estimated_time INTEGER,
    risk_level VARCHAR(20),
    requires_professional BOOLEAN,
    can_diy BOOLEAN,
    order_priority INTEGER,
    week_number INTEGER,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. OPPRETT BUDGET_ALLOCATION TABELL
CREATE TABLE IF NOT EXISTS budget_allocation (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_plan_id UUID REFERENCES project_plans(id) ON DELETE CASCADE,
    category VARCHAR(50),
    percentage DECIMAL(5,2),
    amount DECIMAL(10,2),
    explanation TEXT,
    can_save_here BOOLEAN,
    priority VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. OPPRETT WARNINGS TABELL (for risikoadvarsler)
CREATE TABLE IF NOT EXISTS project_warnings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_plan_id UUID REFERENCES project_plans(id) ON DELETE CASCADE,
    warning_level VARCHAR(20), -- 'critical', 'warning', 'info'
    title VARCHAR(255),
    message TEXT,
    recommendation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. INDEXES FOR YTELSE
CREATE INDEX IF NOT EXISTS idx_project_plans_user_id ON project_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_project_plans_project_id ON project_plans(project_id);
CREATE INDEX IF NOT EXISTS idx_project_steps_plan_id ON project_steps(project_plan_id);
CREATE INDEX IF NOT EXISTS idx_budget_allocation_plan_id ON budget_allocation(project_plan_id);
CREATE INDEX IF NOT EXISTS idx_project_warnings_plan_id ON project_warnings(project_plan_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_quality_level ON products(quality_level);
CREATE INDEX IF NOT EXISTS idx_products_risk_level ON products(risk_level);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE project_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_allocation ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_warnings ENABLE ROW LEVEL SECURITY;

-- Project Plans Policies
CREATE POLICY "Users can view their own project plans"
    ON project_plans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own project plans"
    ON project_plans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own project plans"
    ON project_plans FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own project plans"
    ON project_plans FOR DELETE
    USING (auth.uid() = user_id);

-- Project Steps Policies
CREATE POLICY "Users can view their project steps"
    ON project_steps FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM project_plans
        WHERE project_plans.id = project_steps.project_plan_id
        AND project_plans.user_id = auth.uid()
    ));

CREATE POLICY "Users can create project steps"
    ON project_steps FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM project_plans
        WHERE project_plans.id = project_steps.project_plan_id
        AND project_plans.user_id = auth.uid()
    ));

CREATE POLICY "Users can update their project steps"
    ON project_steps FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM project_plans
        WHERE project_plans.id = project_steps.project_plan_id
        AND project_plans.user_id = auth.uid()
    ));

-- Budget Allocation Policies
CREATE POLICY "Users can view their budget allocation"
    ON budget_allocation FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM project_plans
        WHERE project_plans.id = budget_allocation.project_plan_id
        AND project_plans.user_id = auth.uid()
    ));

-- Warnings Policies
CREATE POLICY "Users can view their warnings"
    ON project_warnings FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM project_plans
        WHERE project_plans.id = project_warnings.project_plan_id
        AND project_plans.user_id = auth.uid()
    ));

-- 8. TRIGGERS FOR UPDATED_AT
CREATE TRIGGER update_project_plans_updated_at
    BEFORE UPDATE ON project_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. OPPDATER EKSISTERENDE PRODUKTER MED SMART DATA
UPDATE products 
SET times_used = 150, avg_rating = 4.5, warranty_years = 5
WHERE name LIKE '%IKEA%' OR name LIKE '%Byggmakker%';

UPDATE products 
SET risk_level = 'critical', diy_friendly = false, 
    expert_tip = 'Alltid bruk sertifisert fagperson for rørleggerarbeid. Lekkasjer kan koste 100 000+ kr å fikse.'
WHERE category = 'bad' AND (name LIKE '%rør%' OR name LIKE '%Rør%');

UPDATE products 
SET risk_level = 'critical', diy_friendly = false,
    expert_tip = 'Membran må legges av fagperson. Vannskader er ekstremt dyrt å fikse.'
WHERE category = 'bad' AND name LIKE '%membran%';

UPDATE products 
SET risk_level = 'low', diy_friendly = true,
    expert_tip = 'Maling er perfekt for egeninnsats. Spar penger her!'
WHERE category = 'maling';

UPDATE products 
SET long_term_value = 5
WHERE category = 'bad' AND (name LIKE '%membran%' OR name LIKE '%fliser%');

UPDATE products 
SET long_term_value = 4
WHERE category = 'gulv' AND name LIKE '%parkett%';

UPDATE products 
SET long_term_value = 2
WHERE category = 'maling';

