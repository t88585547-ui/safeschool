import db from '../config/database';

export interface Building {
  id: number;
  code: string;
  name: string;
  total_floors: number;
  model_coords: string | null;
}

export function findAll(): Building[] {
  return db.prepare('SELECT * FROM buildings ORDER BY id').all() as Building[];
}

export function findById(id: number): Building | undefined {
  return db.prepare('SELECT * FROM buildings WHERE id = ?').get(id) as Building | undefined;
}

export function findByCode(code: string): Building | undefined {
  return db.prepare('SELECT * FROM buildings WHERE code = ?').get(code) as Building | undefined;
}
