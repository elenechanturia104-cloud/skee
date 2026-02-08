
import { z } from 'zod';

// Defines the structure for the super admin user
export const SuperAdminSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  // Add other super admin specific fields here
});

// Defines the structure for a school, including its settings and content
export const SchoolSchema = z.object({
  name: z.string(),
  logo: z.string().url().optional(),
  design: z.object({
    primaryColor: z.string(),
    backgroundColor: z.string(),
    accentColor: z.string(),
  }),
  schedule: z.array(z.object({
    time: z.string(),
    event: z.string(),
  })),
  bellSettings: z.object({
    sound: z.string().url(),
    volume: z.number().min(0).max(100),
  }),
  infoBoard: z.object({
    content: z.string(),
    // Add other info board related fields here
  }),
  refreshInterval: z.enum(['5', '10', '20']),
});

// Defines the structure for a regular admin user associated with a school
export const AdminSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  schoolId: z.string(),
});
