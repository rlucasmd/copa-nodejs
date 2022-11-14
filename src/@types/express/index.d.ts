interface user {
  name: string;
  avatarUrl: string;
  sub: string;
}
export declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      user: user;
    }
  }

}