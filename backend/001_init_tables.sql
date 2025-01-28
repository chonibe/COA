BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE coas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id VARCHAR(255) NOT NULL,
  edition_number INT NOT NULL,
  owner_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  nfc_tag_id UUID
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopify_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE nfc_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uid VARCHAR(255) UNIQUE NOT NULL,
  locked BOOLEAN DEFAULT false,
  coa_id UUID REFERENCES coas(id)
);

COMMIT;