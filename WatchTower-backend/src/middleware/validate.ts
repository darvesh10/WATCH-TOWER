import {type Request, type Response, type NextFunction } from 'express';
import { ZodError, ZodObject } from "zod";
// export const monitorSchema = z.object({
//   url: z.string().url({ message: "Invalid URL format" }),
//   interval: z.number().int().positive().min(10,{ message: "Interval must be a positive integer" }),
// });

export const validate = (schema: ZodObject<any>) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Zod uses .errors or .issues, not .details
        const errorMessage = error.message || "Validation Error";
        return res.status(400).json({ 
          status: "fail", 
          message: errorMessage,
          details: error.errors // Saare errors dekhne ke liye
        });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };