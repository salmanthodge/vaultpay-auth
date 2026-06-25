-- VaultPay auth-service — local DB bootstrap.
-- Run ONCE as the postgres superuser against the PG17 instance (port 5432).
-- Creates the role and database that match DATABASE_URL in .env:
--   postgresql://vaultpay:vaultpay@localhost:5432/vaultpay_auth
--
-- Usage (PowerShell):
--   $env:PGPASSWORD='<postgres-password>'
--   & 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -U postgres -h localhost -p 5432 -f scripts\db-bootstrap.sql
--
-- Idempotent: safe to re-run.

-- 1. Role (login user used by the app)
SELECT 'CREATE ROLE vaultpay LOGIN PASSWORD ''vaultpay'''
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'vaultpay')\gexec

-- 2. Database owned by that role
SELECT 'CREATE DATABASE vaultpay_auth OWNER vaultpay'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'vaultpay_auth')\gexec

-- 3. Privileges
GRANT ALL PRIVILEGES ON DATABASE vaultpay_auth TO vaultpay;
