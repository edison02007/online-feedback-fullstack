const { Pool } = require('pg');

// ✅ Use DATABASE_URL (Render PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// ✅ Create table if not exists
const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        type VARCHAR(20) NOT NULL DEFAULT 'general'
          CHECK (type IN ('general','bug','suggestion','compliment')),
        rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        tags TEXT[] NOT NULL DEFAULT '{}',
        message VARCHAR(500) NOT NULL,
        file VARCHAR(255) DEFAULT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'new'
          CHECK (status IN ('new','reviewed','resolved')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    console.log('✅ PostgreSQL table ready');
  } catch (err) {
    console.error('❌ Error creating table:', err.message);
    throw err;
  }
};

module.exports = { pool, createTable };