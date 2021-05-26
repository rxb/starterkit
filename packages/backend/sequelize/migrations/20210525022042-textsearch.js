'use strict';

// https://medium.com/riipen-engineering/full-text-search-with-sequelize-and-postgresql-3572cb3093e7
// https://stackoverflow.com/questions/45845150/how-to-implement-postgresql-tsvector-for-full-text-search-using-sequelize
// https://obartunov.livejournal.com/194683.html
//https://pgdash.io/blog/postgres-12-generated-columns.html
//https://www.2ndquadrant.com/en/blog/generated-columns-in-postgresql-12/
// https://stackoverflow.com/questions/58665794/possible-reason-to-include-a-tsvector-field
// to_tsquery expects explicit booleans between keywords, plainto_tsquery is more loosey goosey
// generated columns can't pull in text from outside the table, so stored procedures generating the ts_vector column is better -- either of those then gets an index
/*
SELECT
    "draftContent"-> 'blurb'
FROM
    tldrs
WHERE
    to_tsvector('English', "draftContent"::text) @@ plainto_tsquery('English', 'Labore') ;
*/


const vectorName = '_search';

const searchObjects = {
  tldrs: ['"draftContent"'],
};

module.exports = {
  up: async (queryInterface) => {
    const t = await queryInterface.sequelize.transaction();
    const tables = Object.keys(searchObjects);
    try {
      for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        await queryInterface.sequelize.query(`
              ALTER TABLE ${table} ADD COLUMN ${vectorName} TSVECTOR;
            `, { transaction: t })

        await queryInterface.sequelize.query(`
                UPDATE ${table} SET ${vectorName} = to_tsvector('english', ${searchObjects[table].join(" || ' ' || ")});
              `, { transaction: t })

        await queryInterface.sequelize.query(`
                CREATE INDEX ${table}_search ON ${table} USING gin(${vectorName});
              `, { transaction: t })

        await queryInterface.sequelize.query(`
                CREATE TRIGGER ${table}_vector_update
                BEFORE INSERT OR UPDATE ON ${table}
                FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(${vectorName}, 'pg_catalog.english', ${searchObjects[table].join(', ')});
              `, { transaction: t })

        await t.commit();
      }
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
        const table = tables[i];
        await queryInterface.sequelize.query(`
        DROP TRIGGER ${table}_vector_update ON ${table};
      `, { transaction: t })
        await queryInterface.sequelize.query(`
              DROP INDEX ${table}_search;
            `, { transaction: t })
        await queryInterface.sequelize.query(`
              ALTER TABLE ${table} DROP COLUMN ${vectorName};
            `, { transaction: t })
      }
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
