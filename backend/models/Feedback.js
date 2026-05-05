const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.PG_HOST     || 'localhost',
  port:     process.env.PG_PORT     || 5432,
  database: process.env.PG_DATABASE || 'feedbackdb',
  user:     process.env.PG_USER     || 'postgres',
  password: process.env.PG_PASSWORD || '',
});

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(100)  NOT NULL,
      email      VARCHAR(255)  NOT NULL,
      type       VARCHAR(20)   NOT NULL DEFAULT 'general'
                   CHECK (type IN ('general','bug','suggestion','compliment')),
      rating     SMALLINT      NOT NULL CHECK (rating BETWEEN 1 AND 5),
      tags       TEXT[]        NOT NULL DEFAULT '{}',
      message    VARCHAR(500)  NOT NULL,
      file       VARCHAR(255)  DEFAULT NULL,
      status     VARCHAR(20)   NOT NULL DEFAULT 'new'
                   CHECK (status IN ('new','reviewed','resolved')),
      created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );
  `);
  console.log('✅ PostgreSQL table ready');
};

module.exports = { pool, createTable };
