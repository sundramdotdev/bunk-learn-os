import alasql from 'alasql';
import { getMockScenarios } from './mockDbScenarios';

export class SqlService {
    constructor() {
        this.initDefaultDb();
    }

    initDefaultDb() {
        try {
            alasql('CREATE DATABASE IF NOT EXISTS bunk_db');
            alasql('USE bunk_db');
        } catch (e) {
            console.error("Failed to initialize default DB:", e);
        }
    }

    executeQuery(sql) {
        if (!sql || !sql.trim()) return { success: false, data: null, error: "Empty query" };

        try {
            const start = performance.now();
            let result = alasql(sql);
            const duration = Math.round(performance.now() - start);

            // Intercept SHOW DATABASES result to hide internal databases from the output console
            if (Array.isArray(result) && result.length > 0) {
                // Single statement returning databases
                if (result[0].databaseid) {
                    result = result.filter(row => row.databaseid !== 'alasql' && row.databaseid !== 'dbo');
                } 
                // Multi-statement returning arrays of results
                else if (Array.isArray(result[0])) {
                    result = result.map(resultSet => {
                        if (Array.isArray(resultSet) && resultSet.length > 0 && resultSet[0].databaseid) {
                            return resultSet.filter(row => row.databaseid !== 'alasql' && row.databaseid !== 'dbo');
                        }
                        return resultSet;
                    });
                }
            }

            return {
                success: true,
                data: result,
                error: null,
                duration
            };
        } catch (err) {
            return {
                success: false,
                data: null,
                error: err.message,
                duration: 0
            };
        }
    }

    getSchema() {
        try {
            const schema = [];
            const currentDb = alasql.useid;

            // alasql.databases contains all created databases
            for (const dbName in alasql.databases) {
                if (dbName === 'alasql' || dbName === 'dbo') continue; // Skip internal dbs

                const dbObj = alasql.databases[dbName];
                const tables = [];

                for (const tableName in dbObj.tables) {
                    const tableObj = dbObj.tables[tableName];
                    const columns = tableObj.columns || [];

                    tables.push({
                        name: tableName,
                        columns: columns.map(c => ({
                            name: c.columnid,
                            type: c.dbtypeid
                        }))
                    });
                }

                schema.push({
                    name: dbName,
                    tables,
                    isActive: dbName === currentDb
                });
            }

            return schema;
        } catch (e) {
            console.error("Schema fetch error:", e);
            return [];
        }
    }

    getActiveDatabase() {
        return alasql.useid;
    }

    getActiveDbDetails() {
        try {
            const currentDb = alasql.useid;
            if (!currentDb || !alasql.databases[currentDb]) return null;

            const dbObj = alasql.databases[currentDb];
            const tables = [];

            for (const tableName in dbObj.tables) {
                const tableObj = dbObj.tables[tableName];
                let data = [];
                try {
                    data = alasql(`SELECT * FROM ${tableName}`);
                } catch (e) { }

                tables.push({
                    name: tableName,
                    columns: (tableObj.columns || []).map(c => ({
                        name: c.columnid,
                        type: c.dbtypeid
                    })),
                    data: data
                });
            }

            return {
                name: currentDb,
                tables: tables
            };
        } catch (e) {
            console.error("Active DB details error:", e);
            return null;
        }
    }

    loadScenario(scenarioName) {
        const scenarios = getMockScenarios();
        const queries = scenarios[scenarioName];

        if (!queries) return { success: false, error: "Scenario not found" };

        try {
            // AlaSQL supports multiple statements in one string or an array of strings
            // We will pass an array of strings
            for (const query of queries) {
                alasql(query);
            }
            return { success: true, error: null };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }
}
