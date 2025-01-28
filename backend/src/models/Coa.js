const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

class Coa {
  static async create(productId, editionNumber) {
    const result = await pool.query(
      'INSERT INTO coas (product_id, edition_number) VALUES ($1, $2) RETURNING *',
      [productId, editionNumber]
    );
    return result.rows[0];
  }
}

module.exports = Coa;