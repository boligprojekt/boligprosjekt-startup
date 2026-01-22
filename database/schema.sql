-- ============================================
-- BOLIGPROSJEKT DATABASE SCHEMA
-- Abonnementssystem for kunder og håndverkere
-- ============================================

-- ============================================
-- SUBSCRIPTION PLANS (Abonnementsplaner)
-- ============================================

CREATE TABLE subscription_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'customer' eller 'craftsman'
  price_monthly DECIMAL(10, 2) NOT NULL,
  stripe_price_id VARCHAR(255), -- Stripe Price ID
  features JSONB NOT NULL, -- Funksjoner som JSON
  limits JSONB NOT NULL, -- Begrensninger som JSON
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sett inn standard planer
INSERT INTO subscription_plans (name, type, price_monthly, features, limits) VALUES
-- KUNDEABONNEMENTER
('Gratis', 'customer', 0.00, 
  '{"projects": 1, "ai_chat": false, "craftsman_help": false, "support": "basic"}',
  '{"max_projects": 1, "ai_chat_enabled": false}'
),
('Premium', 'customer', 249.99,
  '{"projects": 5, "ai_chat": true, "craftsman_help": true, "support": "priority"}',
  '{"max_projects": 5, "ai_chat_enabled": true}'
),
('Pro', 'customer', 799.99,
  '{"projects": -1, "ai_chat": true, "craftsman_help": true, "support": "dedicated", "consultation": true, "design_help": true}',
  '{"max_projects": -1, "ai_chat_enabled": true}'
),
-- HÅNDVERKERABONNEMENTER
('Basic Visibility', 'craftsman', 299.00,
  '{"visibility": "standard", "project_access": true, "placement": "standard"}',
  '{"priority_level": 1, "guaranteed_leads": 0}'
),
('Pro Håndverker', 'craftsman', 299.99,
  '{"visibility": "premium", "project_access": true, "placement": "top", "notifications": true}',
  '{"priority_level": 2, "guaranteed_leads": 0}'
),
('Pro+ Håndverker', 'craftsman', 699.99,
  '{"visibility": "premium", "project_access": true, "placement": "top", "notifications": true, "guaranteed_leads": 2, "direct_contact": true}',
  '{"priority_level": 3, "guaranteed_leads": 2}'
);

-- ============================================
-- USER SUBSCRIPTIONS (Brukerabonnementer)
-- ============================================

CREATE TABLE user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL, -- Firebase/Supabase User ID
  plan_id INTEGER REFERENCES subscription_plans(id),
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, cancelled, expired, past_due
  stripe_subscription_id VARCHAR(255), -- Stripe Subscription ID
  stripe_customer_id VARCHAR(255), -- Stripe Customer ID
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Index for rask oppslag
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);

-- ============================================
-- CRAFTSMAN PROFILES (Håndverkerprofiler)
-- ============================================

CREATE TABLE craftsman_profiles (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE, -- Firebase/Supabase User ID
  company_name VARCHAR(255) NOT NULL,
  profession VARCHAR(100) NOT NULL, -- 'plumber', 'electrician', 'carpenter', etc.
  description TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  location VARCHAR(255),
  service_areas TEXT[], -- Array av områder de dekker
  certifications TEXT[], -- Sertifiseringer
  rating DECIMAL(3, 2) DEFAULT 0.00, -- Gjennomsnittlig rating
  total_reviews INTEGER DEFAULT 0,
  profile_image_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_craftsman_profiles_user_id ON craftsman_profiles(user_id);
CREATE INDEX idx_craftsman_profiles_profession ON craftsman_profiles(profession);
CREATE INDEX idx_craftsman_profiles_location ON craftsman_profiles(location);

-- ============================================
-- PROJECTS (Prosjekter)
-- ============================================

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL, -- Eier av prosjektet
  title VARCHAR(255) NOT NULL,
  description TEXT,
  room_type VARCHAR(100), -- 'kitchen', 'bathroom', 'bedroom', etc.
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'planning', -- planning, seeking_craftsman, in_progress, completed
  location VARCHAR(255),
  preferred_start_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_room_type ON projects(room_type);

-- ============================================
-- PROJECT LEADS (Leads til håndverkere)
-- ============================================

CREATE TABLE project_leads (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  craftsman_user_id VARCHAR(255) NOT NULL, -- Håndverker som får leadet
  lead_type VARCHAR(50) NOT NULL, -- 'guaranteed' (Pro+) eller 'organic' (søk)
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, accepted, rejected
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  contacted_at TIMESTAMP,
  responded_at TIMESTAMP
);

CREATE INDEX idx_project_leads_craftsman ON project_leads(craftsman_user_id);
CREATE INDEX idx_project_leads_project ON project_leads(project_id);
CREATE INDEX idx_project_leads_status ON project_leads(status);

