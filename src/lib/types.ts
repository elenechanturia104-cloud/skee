import { z } from 'zod';
import { SchoolSchema, SchoolFormDataSchema, BellSoundEnum, BellSettingsSchema } from './schema';

export type School = z.infer<typeof SchoolSchema> & { id: string };
export type SchoolFormData = z.infer<typeof SchoolFormDataSchema>;
export type BellSound = z.infer<typeof BellSoundEnum>;
export type BellSettings = z.infer<typeof BellSettingsSchema>;

export interface ScheduleItem {
  id: string;
  name: string;
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
}

export interface BoardItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint?: string;
}

export interface AppSettings {
  colors: {
    primary: string;
    background: string;
    accent: string;
  };
  soundEnabled: boolean;
  bellSound: BellSound;
}

export interface AdminLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}
