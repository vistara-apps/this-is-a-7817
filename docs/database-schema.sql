-- Symptom Scout Database Schema
-- This file contains the complete database schema for Supabase
-- Run these commands in your Supabase SQL editor to set up the database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE subscription_status AS ENUM ('free', 'premium', 'cancelled');
CREATE TYPE urgency_level AS ENUM ('low', 'moderate', 'high', 'emergency');
CREATE TYPE severity_level AS ENUM ('mild', 'moderate', 'severe');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    subscription_status subscription_status DEFAULT 'free',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Symptom entries table
CREATE TABLE public.symptom_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reported_symptoms TEXT NOT NULL,
    severity severity_level DEFAULT 'mild',
    duration TEXT,
    notes TEXT,
    potential_conditions JSONB,
    urgency_assessment urgency_level DEFAULT 'low',
    urgency_reason TEXT,
    ai_recommendations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Treatment logs table
CREATE TABLE public.treatment_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    symptom_entry_id UUID REFERENCES public.symptom_entries(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    treatment TEXT NOT NULL,
    effectiveness INTEGER CHECK (effectiveness >= 1 AND effectiveness <= 10),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Condition information table (for curated health information)
CREATE TABLE public.condition_info (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    common_symptoms TEXT[],
    treatments TEXT[],
    lifestyle_recommendations TEXT[],
    sources_url TEXT[],
    severity_indicators JSONB,
    when_to_seek_help TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking table (for subscription limits)
CREATE TABLE public.usage_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    feature_name TEXT NOT NULL,
    usage_count INTEGER DEFAULT 0,
    reset_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, feature_name)
);

-- Create indexes for better performance
CREATE INDEX idx_symptom_entries_user_id ON public.symptom_entries(user_id);
CREATE INDEX idx_symptom_entries_timestamp ON public.symptom_entries(timestamp DESC);
CREATE INDEX idx_treatment_logs_user_id ON public.treatment_logs(user_id);
CREATE INDEX idx_treatment_logs_symptom_entry_id ON public.treatment_logs(symptom_entry_id);
CREATE INDEX idx_usage_tracking_user_id ON public.usage_tracking(user_id);
CREATE INDEX idx_condition_info_name ON public.condition_info(name);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_symptom_entries_updated_at BEFORE UPDATE ON public.symptom_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatment_logs_updated_at BEFORE UPDATE ON public.treatment_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_condition_info_updated_at BEFORE UPDATE ON public.condition_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at BEFORE UPDATE ON public.usage_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Symptom entries policies
CREATE POLICY "Users can view own symptom entries" ON public.symptom_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own symptom entries" ON public.symptom_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own symptom entries" ON public.symptom_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own symptom entries" ON public.symptom_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Treatment logs policies
CREATE POLICY "Users can view own treatment logs" ON public.treatment_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own treatment logs" ON public.treatment_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own treatment logs" ON public.treatment_logs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own treatment logs" ON public.treatment_logs
    FOR DELETE USING (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view own usage" ON public.usage_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON public.usage_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON public.usage_tracking
    FOR UPDATE USING (auth.uid() = user_id);

-- Condition info is publicly readable
CREATE POLICY "Anyone can view condition info" ON public.condition_info
    FOR SELECT USING (true);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    
    -- Initialize usage tracking for new user
    INSERT INTO public.usage_tracking (user_id, feature_name, usage_count)
    VALUES (NEW.id, 'symptom_checks', 0);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to increment usage count
CREATE OR REPLACE FUNCTION public.increment_usage(
    p_user_id UUID,
    p_feature_name TEXT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.usage_tracking (user_id, feature_name, usage_count)
    VALUES (p_user_id, p_feature_name, 1)
    ON CONFLICT (user_id, feature_name)
    DO UPDATE SET 
        usage_count = usage_tracking.usage_count + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset usage counts (run monthly)
CREATE OR REPLACE FUNCTION public.reset_usage_counts()
RETURNS VOID AS $$
BEGIN
    UPDATE public.usage_tracking
    SET 
        usage_count = 0,
        reset_date = NOW() + INTERVAL '1 month',
        updated_at = NOW()
    WHERE reset_date <= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample condition information
INSERT INTO public.condition_info (name, description, common_symptoms, treatments, lifestyle_recommendations, sources_url, when_to_seek_help) VALUES
(
    'Common Cold',
    'A viral infection of the upper respiratory tract that typically resolves on its own within 7-10 days.',
    ARRAY['runny nose', 'sneezing', 'cough', 'sore throat', 'mild headache', 'low-grade fever'],
    ARRAY['rest', 'hydration', 'over-the-counter pain relievers', 'throat lozenges', 'saline nasal spray'],
    ARRAY['get plenty of sleep', 'drink lots of fluids', 'wash hands frequently', 'avoid close contact with others'],
    ARRAY['https://www.cdc.gov/features/rhinoviruses/index.html'],
    'Seek medical attention if symptoms worsen after 7 days, fever exceeds 101.3°F (38.5°C), or you develop severe headache, sinus pain, or difficulty breathing.'
),
(
    'Seasonal Allergies',
    'An immune system response to airborne allergens like pollen, dust, or pet dander.',
    ARRAY['sneezing', 'runny nose', 'itchy eyes', 'nasal congestion', 'postnasal drip'],
    ARRAY['antihistamines', 'nasal corticosteroids', 'decongestants', 'allergy shots', 'saline rinses'],
    ARRAY['avoid known allergens', 'keep windows closed during high pollen days', 'use air purifiers', 'shower after being outdoors'],
    ARRAY['https://www.aaaai.org/conditions-and-treatments/allergies/rhinitis'],
    'Consult a doctor if over-the-counter medications are not effective, symptoms interfere with daily activities, or you experience severe reactions.'
),
(
    'Influenza',
    'A contagious respiratory illness caused by influenza viruses, typically more severe than a common cold.',
    ARRAY['high fever', 'body aches', 'fatigue', 'cough', 'sore throat', 'headache', 'chills'],
    ARRAY['antiviral medications', 'rest', 'hydration', 'fever reducers', 'cough suppressants'],
    ARRAY['get annual flu vaccine', 'rest until fever-free for 24 hours', 'stay hydrated', 'avoid contact with others'],
    ARRAY['https://www.cdc.gov/flu/'],
    'Seek immediate medical care if you have difficulty breathing, chest pain, persistent dizziness, severe dehydration, or worsening of chronic conditions.'
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON public.condition_info TO anon;

-- Create a view for user dashboard data
CREATE VIEW public.user_dashboard AS
SELECT 
    u.id,
    u.email,
    u.subscription_status,
    u.created_at as user_since,
    COUNT(se.id) as total_symptom_entries,
    COUNT(tl.id) as total_treatment_logs,
    ut.usage_count as symptom_checks_used,
    ut.reset_date as usage_reset_date,
    CASE 
        WHEN u.subscription_status = 'premium' THEN -1
        ELSE GREATEST(0, 3 - COALESCE(ut.usage_count, 0))
    END as remaining_checks
FROM public.users u
LEFT JOIN public.symptom_entries se ON u.id = se.user_id
LEFT JOIN public.treatment_logs tl ON u.id = tl.user_id
LEFT JOIN public.usage_tracking ut ON u.id = ut.user_id AND ut.feature_name = 'symptom_checks'
WHERE u.id = auth.uid()
GROUP BY u.id, u.email, u.subscription_status, u.created_at, ut.usage_count, ut.reset_date;

-- Grant access to the view
GRANT SELECT ON public.user_dashboard TO authenticated;
