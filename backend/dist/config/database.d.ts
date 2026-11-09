export interface DBInterface {
    prepare: (sql: string) => {
        run: (...params: any[]) => {
            changes: number | bigint;
            lastInsertRowid: number | bigint;
        };
        get: (...params: any[]) => any;
        all: (...params: any[]) => any[];
    };
    exec: (sql: string) => void;
    pragma: (sql: string) => void;
    transaction: <T extends (...args: any[]) => any>(fn: T) => T;
}
declare const db: DBInterface;
export declare function initializeSchema(): void;
export default db;
//# sourceMappingURL=database.d.ts.map