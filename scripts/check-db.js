import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new pg.Client(process.env.DATABASE_URI);

async function checkDatabase() {
  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    // Get all tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    const tables = await client.query(tablesQuery);
    console.log('Tables found:', tables.rows.length);
    
    for (const table of tables.rows) {
      const tableName = table.table_name;
      
      // Get column info
      const columnsQuery = `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = $1
        ORDER BY ordinal_position;
      `;
      const columns = await client.query(columnsQuery, [tableName]);
      
      // Get row count
      const countQuery = `SELECT COUNT(*) FROM "${tableName}"`;
      const count = await client.query(countQuery);
      
      console.log(`\n📋 ${tableName}`);
      console.log('Rows:', count.rows[0].count);
      console.log('Columns:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}, ${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabase();
