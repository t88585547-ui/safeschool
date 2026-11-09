import * as UserModel from '../models/userModel';
export interface JwtPayload {
    userId: number;
    studentOrStaffId: string;
    role: UserModel.UserRole;
}
export declare function login(studentOrStaffId: string, password: string): Promise<{
    token: string;
    user: UserModel.UserPublic;
}>;
export declare function register(data: {
    student_or_staff_id: string;
    full_name: string;
    role: UserModel.UserRole;
    password: string;
}): Promise<UserModel.UserPublic>;
export declare function verifyToken(token: string): JwtPayload;
//# sourceMappingURL=authService.d.ts.map