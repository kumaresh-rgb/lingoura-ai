import { z } from 'zod';

const emailSchema = z
  .string()
  .min(1, 'Email address is required.')
  .email('Please enter a valid email address.')
  .trim();

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.');

const strongPasswordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters.')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .regex(/[0-9]/, 'Password must contain at least one number.')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.'),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'Please enter your first name.')
      .max(50, 'First name cannot exceed 50 characters.')
      .trim(),
    lastName: z
      .string()
      .min(1, 'Please enter your last name.')
      .max(50, 'Last name cannot exceed 50 characters.')
      .trim(),
    email: emailSchema,
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    token: z.string().min(1, 'Reset token is required.'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
