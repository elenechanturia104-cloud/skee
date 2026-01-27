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
  bellSound: string;
}

export interface AdminLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}
