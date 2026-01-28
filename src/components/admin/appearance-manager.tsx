'use client';

import { useChronoBoard } from '@/hooks/use-chronoboard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { AppSettings } from '@/lib/types';
import { Undo } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bellSounds, BellSoundName } from '@/lib/sounds';
import * as Tone from 'tone';

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    const hslToHex = (hsl: string): string => {
        if (!hsl) return '#000000';
        const result = hsl.match(/\d+(\.\d+)?/g);
        if (!result) return '#000000';

        const [h, s, l] = result.map(Number);
        const sNorm = s / 100;
        const lNorm = l / 100;
        const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = lNorm - c / 2;
        let r = 0, g = 0, b = 0;

        if (h >= 0 && h < 60) { [r,g,b] = [c,x,0]; }
        else if (h >= 60 && h < 120) { [r,g,b] = [x,c,0]; }
        else if (h >= 120 && h < 180) { [r,g,b] = [0,c,x]; }
        else if (h >= 180 && h < 240) { [r,g,b] = [0,x,c]; }
        else if (h >= 240 && h < 300) { [r,g,b] = [x,0,c]; }
        else if (h >= 300 && h < 360) { [r,g,b] = [c,0,x]; }
        
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    const hexValue = useMemo(() => hslToHex(value), [value]);

    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Label>{label}</Label>
            <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-sm text-muted-foreground w-40 truncate">{value}</span>
                <Input type="color" value={hexValue} onChange={onChange} className="w-12 h-10 p-1" />
            </div>
        </div>
    );
};


export function AppearanceManager() {
  const { settings, setSettings, resetColorSettings, addLog } = useChronoBoard();
  const { toast } = useToast();
  const [synth, setSynth] = useState<Tone.Synth | null>(null);

  useEffect(() => {
    setSynth(new Tone.Synth().toDestination());
  }, []);

  const playSound = (soundName: BellSoundName) => {
    if (synth) {
      try {
        Tone.start();
        const soundPreset = bellSounds[soundName] || bellSounds.default;
        const now = Tone.now();
        soundPreset.notes.forEach((note, i) => {
          synth.triggerAttackRelease(note, soundPreset.duration, now + i * soundPreset.interval);
        });
      } catch (e) {
        console.error("Could not play sound:", e);
        toast({
          variant: 'destructive',
          title: 'ხმის დაკვრა ვერ მოხერხდა',
          description: 'დაფიქსირდა შეცდომა ხმის დაკვრისას.',
        });
      }
    }
  };

  const handleColorChange = (key: keyof AppSettings['colors']) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    let h = 0, s = 0, l = 0;
    const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
    const cmax = Math.max(rNorm, gNorm, bNorm), cmin = Math.min(rNorm, gNorm, bNorm);
    const delta = cmax - cmin;
    if (delta === 0) h = 0;
    else if (cmax === rNorm) h = 60 * (((gNorm - bNorm) / delta) % 6);
    else if (cmax === gNorm) h = 60 * ((bNorm - rNorm) / delta + 2);
    else h = 60 * ((rNorm - gNorm) / delta + 4);
    h = Math.round(h);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    const newHsl = `${h} ${s}% ${l}%`;

    setSettings(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: newHsl },
    }));
  };
  
  const handleSoundToggle = (checked: boolean) => {
    setSettings(prev => ({ ...prev, soundEnabled: checked }));
  }

  const handleSoundPresetChange = (value: BellSoundName) => {
    setSettings(prev => ({ ...prev, bellSound: value }));
    if (settings.soundEnabled) {
      playSound(value);
    }
  }

  const handleSaveChanges = () => {
    addLog('გარეგნობა განახლდა', 'გარეგნობის ახალი პარამეტრები შეინახა.');
    toast({
        title: 'გარეგნობა შენახულია',
        description: 'თქვენი გარეგნობის ახალი პარამეტრები გამოყენებულია.',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">გარეგნობა და ხმა</CardTitle>
        <CardDescription>დაფის იერსახისა და შეგრძნებების მორგება.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
            <h4 className="font-medium">ფერები</h4>
            <ColorInput label="მთავარი" value={settings.colors.primary} onChange={handleColorChange('primary')} />
            <ColorInput label="ფონი" value={settings.colors.background} onChange={handleColorChange('background')} />
            <ColorInput label="აქცენტი" value={settings.colors.accent} onChange={handleColorChange('accent')} />
        </div>
        <div className="space-y-4">
            <h4 className="font-medium">ხმა</h4>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Label htmlFor="sound-enabled">ზარის ხმის ჩართვა</Label>
                <Switch id="sound-enabled" checked={settings.soundEnabled} onCheckedChange={handleSoundToggle} />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Label htmlFor="sound-preset">ზარის ხმის პარამეტრი</Label>
                <Select value={settings.bellSound} onValueChange={handleSoundPresetChange}>
                    <SelectTrigger id="sound-preset" className="w-full sm:w-[180px]">
                        <SelectValue placeholder="აირჩიეთ ხმა" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(bellSounds).map(([key, { name }]) => (
                            <SelectItem key={key} value={key as BellSoundName}>{name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={() => {
            resetColorSettings();
            addLog('გარეგნობა აღდგა', 'ფერები დაბრუნდა საწყის მდგომარეობაში.');
            toast({ title: 'ფერები აღდგენილია', description: 'ფერები დაუბრუნდა თავდაპირველ მნიშვნელობებს.'});
        }}>
            <Undo className="mr-2 h-4 w-4" /> ფერების აღდგენა
        </Button>
        <Button onClick={handleSaveChanges}>ცვლილებების შენახვა</Button>
      </CardFooter>
    </Card>
  );
}
