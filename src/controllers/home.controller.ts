import { Request, Response } from "express";
import pool from "../config/database";

export const home = async (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "MDC Backend API is running",
  });
};

export const dbTest = async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT NOW()");

  res.json({
    success: true,
    message: "PostgreSQL connected",
    data: result.rows[0],
  });
};