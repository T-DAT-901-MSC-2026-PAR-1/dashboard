-- Database initialization script for CryptoViz Dashboard
-- This script runs automatically when PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create initial schema
-- Add your tables here as you develop the application

-- Example: Create a table for cryptocurrency prices
-- CREATE TABLE IF NOT EXISTS crypto_prices (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     crypto VARCHAR(10) NOT NULL,
--     currency VARCHAR(10) NOT NULL,
--     price DECIMAL(20, 8) NOT NULL,
--     timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );

-- Example: Create indexes
-- CREATE INDEX IF NOT EXISTS idx_crypto_prices_timestamp ON crypto_prices(timestamp DESC);
-- CREATE INDEX IF NOT EXISTS idx_crypto_prices_crypto_currency ON crypto_prices(crypto, currency);

GRANT ALL PRIVILEGES ON DATABASE cryptoviz TO postgres;
