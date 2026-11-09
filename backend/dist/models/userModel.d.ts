export interface User {
    id: number;
    student_or_staff_id: string;
    full_name: string;
    role: 'STUDENT' | 'TEACHER' | 'STAFF_MEDICAL' | 'STAFF_FACILITY' | 'ADMIN';
    password_hash: string;
    safety_points: number;
    created_at: string;
}
export type UserRole = User['role'];
export interface UserPublic {
    id: number;
    student_or_staff_id: string;
    full_name: string;
    role: UserRole;
    safety_points: number;
    created_at: string;
}
export declare function findByStaffId(studentOrStaffId: string): User | undefined;
export declare function findById(id: number): User | undefined;
export declare function createUser(data: {
    student_or_staff_id: string;
    full_name: string;
    role: UserRole;
    password_hash: string;
}): User;
export declare function addSafetyPoints(userId: number, points: number): void;
export declare function getAllUsers(): UserPublic[];
export declare function toPublic(user: User): UserPublic;
//# sourceMappingURL=userModel.d.ts.map