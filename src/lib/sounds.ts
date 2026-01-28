export const bellSounds = {
  gentle: { name: 'ნაზი', notes: ['E5', 'A5'], duration: '0.4', interval: 0.3 },
  classic: { name: 'კლასიკური', notes: ['G5', 'C5', 'G5'], duration: '0.5', interval: 0.4 },
  cheerful: { name: 'მხიარული', notes: ['C5', 'D5', 'E5', 'G5'], duration: '0.2', interval: 0.2 },
  attention: { name: 'ყურადღება', notes: ['A5', 'A5'], duration: '0.1', interval: 0.15 },
  digital: { name: 'ციფრული', notes: ['B5', 'E6'], duration: '0.3', interval: 0.2 },
};

export type BellSoundName = keyof typeof bellSounds;
