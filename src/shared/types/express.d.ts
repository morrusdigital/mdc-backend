declare namespace Express {
  interface Request {
    authUser?: {
      id: number;
      email: string;
      roles: string[];
      permissions: string[];
      sessionId: string;
    };
  }
}
