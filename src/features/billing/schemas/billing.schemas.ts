import { z } from 'zod';

export const checkoutSchema = z.object({
  plan: z.enum(['PRO', 'TEAM', 'ENTERPRISE']),
  interval: z.enum(['monthly', 'annual']),
});

export const cancelSchema = z.object({
  reason: z.string().min(1, 'Please provide a reason').max(500),
  feedback: z.string().max(1000).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CancelInput = z.infer<typeof cancelSchema>;
