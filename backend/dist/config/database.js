"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSchema = initializeSchema;
const node_sqlite_1 = require("node:sqlite");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_1 = require("./env");
const dbDir = path_1.default.dirname(env_1.env.DB_PATH);
if (!fs_1.default.existsSync(dbDir)) {
    fs_1.default.mkdirSync(dbDir, { recursive: true });
}
// Instantiate native Node.js SQLite database
const rawDb = new node_sqlite_1.DatabaseSync(env_1.env.DB_PATH);
// Enable WAL mode and pragmas
rawDb.exec('PRAGMA journal_mode = WAL;');
rawDb.exec('PRAGMA foreign_keys = ON;');
rawDb.exec('PRAGMA busy_timeout = 5000;');
const db = {
    prepare: (sql) => {
        const stmt = rawDb.prepare(sql);
        return {
            run: (...params) => stmt.run(...params),
            get: (...params) => stmt.get(...params),
            all: (...params) => stmt.all(...params),
        };
    },
    exec: (sql) => rawDb.exec(sql),
    pragma: (sql) => rawDb.exec(`PRAGMA ${sql};`),
    transaction: (fn) => {
        return ((...args) => {
            rawDb.exec('BEGIN');
            try {
                const result = fn(...args);
                rawDb.exec('COMMIT');
                return result;
            }
            catch (error) {
                rawDb.exec('ROLLBACK');
                throw error;
            }
        });
    },
};
function initializeSchema() {
    const schemaPath = path_1.default.resolve(__dirname, '../../database/schema.sql');
    const schema = fs_1.default.readFileSync(schemaPath, 'utf-8');
    rawDb.exec(schema);
}
exports.default = db;
//# sourceMappingURL=database.js.map