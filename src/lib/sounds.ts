export const bellSounds = {
  default: { name: 'სტანდარტული', notes: ['C5', 'G4'], duration: '0.5', interval: 0.3 },
  ding: { name: 'წკარუნი', notes: ['A5'], duration: '0.2', interval: 0 },
  school: { name: 'სკოლის ზარი', notes: ['E5', 'C5'], duration: '0.8', interval: 0.5 },
  ascending: { name: 'აღმავალი', notes: ['C4', 'E4', 'G4', 'C5'], duration: '0.3', interval: 0.2 },
  descending: { name: 'დაღმავალი', notes: ['C5', 'G4', 'E4', 'C4'], duration: '0.3', interval: 0.2 },
};

export type BellSoundName = keyof typeof bellSounds;
