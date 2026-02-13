import { z } from 'zod';

// Define the allowed bell sounds
export const BellSoundEnum = z.enum([
  'school', 
  'gentle', 
  'classic', 
  'cheerful', 
  'attention', 
  'digital'
]);

export const BellSettingsSchema = z.object({
  sound: BellSoundEnum,
  volume: z.number().min(0).max(100),
});

export const ScheduleItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export const BoardItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  imageHint: z.string().optional(),
});

export const AppSettingsSchema = z.object({
  colors: z.object({
    primary: z.string(),
    background: z.string(),
    accent: z.string(),
  }),
  soundEnabled: z.boolean(),
  bellSound: BellSoundEnum, // Use the enum here
});

export const SchoolSchema = z.object({
  name: z.string(),
  logo: z.string().url().optional(),
  design: z.object({
    primaryColor: z.string(),
    backgroundColor: z.string(),
    accentColor: z.string(),
  }),
  schedule: z.array(ScheduleItemSchema),
  bellSettings: BellSettingsSchema,
  infoBoard: z.object({
    content: z.string(),
  }),
  refreshInterval: z.string(), 
  adminPassword: z.string(),
});

export const SchoolFormDataSchema = SchoolSchema.omit({ adminPassword: true });
