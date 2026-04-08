import { z } from 'zod';

export const PrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

export const UserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  avatarUrl: z.string().url().or(z.literal('')),
});

export const TaskSchema = z.object({
  id: z.string().min(1, 'Invalid task ID'),
  columnId: z.string().min(1, 'Invalid column ID'),
  boardId: z.string().min(1, 'Invalid board ID'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().max(2000, 'Description is too long'),
  priority: PrioritySchema,
  assignee: UserSchema.nullable(),
  dueDate: z.string().nullable(),
  tags: z.array(z.string()),
  position: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
}) as z.ZodType<import('../../domain/entities').Task>;

// For API validations - incoming payload
export const CreateTaskRequestSchema = z.object({
  boardId: z.string().min(1, 'Board ID is required'),
  columnId: z.string().min(1, 'Column ID is required'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  priority: PrioritySchema.optional(),
  dueDate: z.string().datetime().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

export const PatchTaskRequestSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long').optional(),
  description: z.string().max(2000, 'Description is too long').optional(),
  columnId: z.string().min(1).optional(),
  position: z.number().optional(),
  priority: PrioritySchema.optional(),
  dueDate: z.string().datetime().nullable().optional(),
  tags: z.array(z.string()).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for an update',
});

// Infer types (these map accurately to our existing domain/entities.ts types)
export type ZodTask = z.infer<typeof TaskSchema>;
export type ZodCreateTaskRequest = z.infer<typeof CreateTaskRequestSchema>;
export type ZodPatchTaskRequest = z.infer<typeof PatchTaskRequestSchema>;
