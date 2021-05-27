'use strict';

// https://medium.com/riipen-engineering/full-text-search-with-sequelize-and-postgresql-3572cb3093e7
// https://stackoverflow.com/questions/45845150/how-to-implement-postgresql-tsvector-for-full-text-search-using-sequelize
// https://obartunov.livejournal.com/194683.html
//https://pgdash.io/blog/postgres-12-generated-columns.html
//https://www.2ndquadrant.com/en/blog/generated-columns-in-postgresql-12/
// https://stackoverflow.com/questions/58665794/possible-reason-to-include-a-tsvector-field
// http://rachbelaid.com/postgres-full-text-search-is-good-enough/
//https://www.compose.com/articles/indexing-for-full-text-search-in-postgresql/
// to_tsquery expects explicit booleans between keywords, plainto_tsquery is more loosey goosey
// generated columns can't pull in text from outside the table, so stored procedures generating the ts_vector column is better -- either of those then gets an index



const vectorName = '_search';

const searchObjects = {
  tldrs: ['"currentTldrVersionContent"'],
};

module.exports = {
  up: async (queryInterface) => {
    const t = await queryInterface.sequelize.transaction();
    const tables = Object.keys(searchObjects);
    try {
      for (let i = 0; i < tables.length; i++) {
        try {
          const table = tables[i];

          // add _search column 
          await queryInterface.sequelize.query(`
                ALTER TABLE ${table} ADD COLUMN ${vectorName} TSVECTOR;
              `, { transaction: t })

          // populate _search for preexisting records 
          // postgres 10+ handles jsonb columns in to_tsvector
          await queryInterface.sequelize.query(`
                  UPDATE ${table} SET ${vectorName} = to_tsvector('english', ${searchObjects[table].join(" || ' ' || ")});
                `, { transaction: t })

          // add gin index
          await queryInterface.sequelize.query(`
                  CREATE INDEX ${table}_search ON ${table} USING gin(${vectorName});
                `, { transaction: t })

          // create postgres function to be called by the trigger the tsvector_update_trigger can onl handle very simple updates
          const columnsForTrigger = searchObjects[table]
                                      //.map(col=>col.replace(/["]+/g, ''))
                                      .map(col=>`new.${col}`)
                                      .join(" || ' ' || ");
          const queryForTrigger = `
            CREATE FUNCTION ${table}_trigger() RETURNS trigger AS $$  
            begin  
              new.${vectorName} :=
                to_tsvector('english', ${columnsForTrigger});
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
        }
        catch (error) {
          console.log('catch');
          console.log(error);
          throw error;
        }
      }
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
    const tables = Object.keys(searchObjects);
    try {
      for (let i = 0; i < tables.length; i++) {
        try {
          const table = tables[i];
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
        }
        catch (error) {
          throw error;
        }
      }
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
