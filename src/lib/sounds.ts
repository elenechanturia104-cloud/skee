export const bellSounds = {
  gentle: { name: 'ნაზი', notes: ['E5', 'G5', 'B5'], duration: '0.5', interval: 0.4 },
  classic: { name: 'კლასიკური', notes: ['G5', 'E5'], duration: '0.7', interval: 0.6 },
  cheerful: { name: 'მხიარული', notes: ['C5', 'E5', 'G5', 'C6'], duration: '0.2', interval: 0.15 },
  attention: { name: 'ყურადღება', notes: ['A#5', 'A#5', 'A#5'], duration: '0.1', interval: 0.1 },
  digital: { name: 'ციფრული', notes: ['F#6', 'D6'], duration: '0.2', interval: 0.3 },
  school: { name: 'სკოლის ზარი', notes: ['A5', 'A5', 'A5', 'A5', 'A5'], duration: '0.3', interval: 0.35 },
};

export type BellSoundName = keyof typeof bellSounds;
