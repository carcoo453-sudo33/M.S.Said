export interface AuthResponse {
    success: boolean;
    message: string;
    token?: string;
    email?: string;
    userId?: string;
}
