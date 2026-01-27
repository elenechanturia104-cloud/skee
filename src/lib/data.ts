import type { ScheduleItem, BoardItem } from './types';

export const initialSchedule: ScheduleItem[] = [
  { id: '1', name: 'გაკვეთილი 1', startTime: '09:00', endTime: '09:45' },
  { id: '2', name: 'გაკვეთილი 2', startTime: '09:50', endTime: '10:35' },
  { id: '3', name: 'დასვენება', startTime: '10:35', endTime: '10:50' },
  { id: '4', name: 'გაკვეთილი 3', startTime: '10:50', endTime: '11:35' },
  { id: '5', name: 'დიდი დასვენება', startTime: '11:35', endTime: '12:20' },
  { id: '6', name: 'გაკვეთილი 4', startTime: '12:20', endTime: '13:05' },
];

export const initialBoardItems: BoardItem[] = [
  {
    id: '1',
    title: 'ხელოვნური ინტელექტის ტრენინგი დღეს!',
    description: 'შემოგვიერთდით მთავარ საკონფერენციო დარბაზში 14:00 საათზე, ხელოვნური ინტელექტისა და მანქანური სწავლების ახალი მიდგომების შესახებ საინტერესო ტრენინგზე. ყველა დეპარტამენტი მიწვეულია!',
    imageUrl: 'https://picsum.photos/seed/101/1200/800',
    imageHint: 'ხელოვნური ინტელექტის ტრენინგი'
  },
  {
    id: '2',
    title: 'კვარტალური შეხვედრა',
    description: 'მე-3 კვარტლის მიმოხილვის შეხვედრა დაგეგმილია ამ პარასკევს. გთხოვთ, შეამოწმოთ თქვენი კალენდრები და მოემზადოთ ჩვენი პროგრესისა და სამომავლო მიზნების განსახილველად.',
    imageUrl: 'https://picsum.photos/seed/102/1200/800',
    imageHint: 'გუნდური შეხვედრა'
  },
  {
    id: '3',
    title: 'მივესალმოთ ახალ თანამშრომლებს',
    description: "მოდით, თბილად მივესალმოთ ჩვენი გუნდის ახალ წევრებს! მათ შეგიძლიათ შეხვდეთ ყავის შესვენების დროს სამზარეულოში. მიესალმეთ და გაეცანით ერთმანეთს!",
    imageUrl: 'https://picsum.photos/seed/104/1200/800',
    imageHint: 'კომპანიის ღონისძიება'
  },
];
