export interface Building {
    id: number;
    code: string;
    name: string;
    total_floors: number;
    model_coords: string | null;
}
export declare function findAll(): Building[];
export declare function findById(id: number): Building | undefined;
export declare function findByCode(code: string): Building | undefined;
//# sourceMappingURL=buildingModel.d.ts.map