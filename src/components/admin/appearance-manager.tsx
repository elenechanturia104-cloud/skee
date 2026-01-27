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
import { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bellSounds, BellSoundName } from '@/lib/sounds';

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
        <div className="flex items-center justify-between">
            <Label>{label}</Label>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-40 truncate">{value}</span>
                <Input type="color" value={hexValue} onChange={onChange} className="w-12 h-10 p-1" />
            </div>
        </div>
    );
};


export function AppearanceManager() {
  const { settings, setSettings, resetColorSettings } = useChronoBoard();
  const { toast } = useToast();

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
  }

  const handleSaveChanges = () => {
    toast({
        title: 'Appearance Saved',
        description: 'Your new appearance settings have been applied.',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Appearance & Sound</CardTitle>
        <CardDescription>Customize the look and feel of the board.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
            <h4 className="font-medium">Colors</h4>
            <ColorInput label="Primary" value={settings.colors.primary} onChange={handleColorChange('primary')} />
            <ColorInput label="Background" value={settings.colors.background} onChange={handleColorChange('background')} />
            <ColorInput label="Accent" value={settings.colors.accent} onChange={handleColorChange('accent')} />
        </div>
        <div className="space-y-4">
            <h4 className="font-medium">Sound</h4>
            <div className="flex items-center justify-between">
                <Label htmlFor="sound-enabled">Enable Bell Sound</Label>
                <Switch id="sound-enabled" checked={settings.soundEnabled} onCheckedChange={handleSoundToggle} />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="sound-preset">Bell Sound Preset</Label>
                <Select value={settings.bellSound} onValueChange={handleSoundPresetChange}>
                    <SelectTrigger id="sound-preset" className="w-[180px]">
                        <SelectValue placeholder="Select a sound" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(bellSounds).map(([key, { name }]) => (
                            <SelectItem key={key} value={key}>{name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={() => {
            resetColorSettings();
            toast({ title: 'Colors Reset', description: 'The colors have been reset to their defaults.'});
        }}>
            <Undo className="mr-2 h-4 w-4" /> Reset Colors
        </Button>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
