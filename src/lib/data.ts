import type { ScheduleItem, BoardItem } from './types';

export const initialSchedule: ScheduleItem[] = [
  { id: '1', name: 'Period 1', startTime: '09:00', endTime: '09:45' },
  { id: '2', name: 'Period 2', startTime: '09:50', endTime: '10:35' },
  { id: '3', name: 'Break', startTime: '10:35', endTime: '10:50' },
  { id: '4', name: 'Period 3', startTime: '10:50', endTime: '11:35' },
  { id: '5', name: 'Lunch', startTime: '11:35', endTime: '12:20' },
  { id: '6', name: 'Period 4', startTime: '12:20', endTime: '13:05' },
];

export const initialBoardItems: BoardItem[] = [
  {
    id: '1',
    title: 'AI Training Session Today!',
    description: 'Join us in the main conference room at 2 PM for an exciting training session on Artificial Intelligence and our new approach to machine learning. All departments are welcome!',
    imageUrl: 'https://picsum.photos/seed/101/1200/800',
    imageHint: 'AI training'
  },
  {
    id: '2',
    title: 'Quarterly Review Meeting',
    description: 'The Q3 review meeting is scheduled for this Friday. Please check your calendars for the invite and come prepared to discuss our progress and future goals.',
    imageUrl: 'https://picsum.photos/seed/102/1200/800',
    imageHint: 'team meeting'
  },
  {
    id: '3',
    title: 'Welcome Our New Hires',
    description: "Let's give a warm welcome to the new members of our team! You can meet them during the coffee break in the kitchen area. Say hello and introduce yourselves!",
    imageUrl: 'https://picsum.photos/seed/104/1200/800',
    imageHint: 'company event'
  },
];
