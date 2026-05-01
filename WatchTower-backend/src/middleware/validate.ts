import { z } from 'zod';

export const monitorSchema = z.object({
  url: z.string().url({ message: "Invalid URL format" }),
  interval: z.number().int().positive().min(10,{ message: "Interval must be a positive integer" }),
});