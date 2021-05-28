'use strict';

const vectorName = '_search';
const table = 'tldrs';
/*
const makeVectorQuery = (tablePrefix = '') => {
  const cols = ['"currentTldrVersionContent"'];
  const formattedColumns = cols
    .map(col => `${tablePrefix}${col}`)
    .join(" || ' ' || ");
  return `to_tsvector('english', ${formattedColumns})`;
}
*/


const makeVectorQuery = (tablePrefix = '') => {
  const col = `${tablePrefix}"currentTldrVersionContent"`;
  const coalesceKey = (key) => `coalesce(${col} ->> '${key}', '')`;
  const vectorQuery = `
    setweight(to_tsvector('english', ${coalesceKey('title')}), 'A') || ' ' || 
    setweight(to_tsvector('english', ${coalesceKey('blurb')}), 'B') || ' ' ||
    setweight(to_tsvector('english', ${coalesceKey('steps')}), 'C')
  `;
  return vectorQuery;
}

module.exports = {
  up: async (queryInterface) => {
    const t = await queryInterface.sequelize.transaction();
    try {

      // add _search column 
      await queryInterface.sequelize.query(`
                ALTER TABLE ${table} ADD COLUMN ${vectorName} TSVECTOR;
              `, { transaction: t })

      // populate _search for preexisting records 
      // postgres 10+ handles jsonb columns in to_tsvector
      const queryForUpdate = `
        UPDATE ${table} SET ${vectorName} = (
          ${makeVectorQuery()}
        );
      `;
      await queryInterface.sequelize.query(queryForUpdate, { transaction: t })

      // add gin index
      await queryInterface.sequelize.query(`
                  CREATE INDEX ${table}_search ON ${table} USING gin(${vectorName});
                `, { transaction: t })

      // create postgres function to be called by the trigger the tsvector_update_trigger can onl handle very simple updates
      const queryForTrigger = `
            CREATE FUNCTION ${table}_trigger() RETURNS trigger AS $$  
            begin  
              new.${vectorName} :=
                ${makeVectorQuery('new.')};
              return new;
            end  
            $$ LANGUAGE plpgsql;
          `;
      console.log(queryForTrigger);
      await queryInterface.sequelize.query(queryForTrigger, { transaction: t })

      // add trigger to postgres function
      await queryInterface.sequelize.query(`
                  CREATE TRIGGER ${table}_vector_update
                  BEFORE INSERT OR UPDATE ON ${table}
                  FOR EACH ROW EXECUTE FUNCTION ${table}_trigger();
                `, { transaction: t })

      await t.commit();
    }
    catch (error) {
      t.rollback()
      throw error;
    }
    finally {
      return t;
    }
  },

  down: async (queryInterface) => {
    const t = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.sequelize.query(`
              DROP TRIGGER IF EXISTS ${table}_vector_update ON ${table};
              `, { transaction: t })
      await queryInterface.sequelize.query(`
                DROP INDEX IF EXISTS ${table}_search;
              `, { transaction: t })
      await queryInterface.sequelize.query(`
                DROP FUNCTION IF EXISTS ${table}_trigger;
              `, { transaction: t })
      await queryInterface.sequelize.query(`
                ALTER TABLE ${table} DROP COLUMN IF EXISTS ${vectorName};
              `, { transaction: t })

      await t.commit();
    }
    catch (error) {
      t.rollback()
      throw error;
    }
    finally {
      return t;
    }

  }
};
