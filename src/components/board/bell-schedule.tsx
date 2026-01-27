'use client';

import React, { useState, useEffect } from 'react';
import { useChronoBoard } from '@/hooks/use-chronoboard';
import { Bell, Volume2, VolumeX } from 'lucide-react';
import * as Tone from 'tone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ChronoBoardLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { bellSounds, BellSoundName } from '@/lib/sounds';

export function BellSchedule() {
  const { schedule, settings, setSettings, setIsBreakTime } = useChronoBoard();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isRinging, setIsRinging] = useState(false);
  const [synth, setSynth] = useState<Tone.Synth | null>(null);

  useEffect(() => {
    // Initialize synth on client
    setSynth(new Tone.Synth().toDestination());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkSchedule = () => {
      const now = currentTime;
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds();
      const timeNow = `${hours}:${minutes}`;

      let currentLesson = null;
      let shouldRing = false;

      for (const item of schedule) {
        if (timeNow >= item.startTime && timeNow < item.endTime) {
          currentLesson = item.id;
        }
        if ((timeNow === item.startTime || timeNow === item.endTime) && seconds === 0) {
          shouldRing = true;
        }
      }

      const activeLesson = schedule.find(item => item.id === currentLesson);
      const isBreak = activeLesson ? activeLesson.name.toLowerCase().includes('break') || activeLesson.name.toLowerCase().includes('დასვენება') : false;
      setIsBreakTime(isBreak);

      setActiveLessonId(currentLesson);

      if (shouldRing) {
        setIsRinging(true);
        if (synth && settings.soundEnabled) {
          try {
            Tone.start(); // Required for browsers that block audio context
            const soundPreset = bellSounds[settings.bellSound as BellSoundName] || bellSounds.default;
            const now = Tone.now();
            soundPreset.notes.forEach((note, i) => {
              synth.triggerAttackRelease(note, soundPreset.duration, now + i * soundPreset.interval);
            });
          } catch (e) {
            console.error("Could not play sound:", e);
          }
        }
        setTimeout(() => setIsRinging(false), 5000); // Ring for 5 seconds
      }
    };

    checkSchedule();
  }, [currentTime, schedule, synth, settings.soundEnabled, settings.bellSound, setIsBreakTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const toggleSound = () => {
    setSettings(prev => ({...prev, soundEnabled: !prev.soundEnabled}));
  }

  return (
    <Card className="flex flex-col h-full w-full rounded-none border-0 border-r bg-card/50 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <ChronoBoardLogo className="h-8 w-8 text-primary" />
          <CardTitle className="font-headline text-2xl tracking-tight">ქრონო-დაფა</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSound}>
          {settings.soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-0">
        <div className="p-4 text-center border-b border-border/50">
          <p className="font-mono text-4xl font-bold text-primary tracking-widest">
            {formatTime(currentTime)}
          </p>
          <p className="text-sm text-muted-foreground">{currentTime.toDateString()}</p>
        </div>
        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-2">
            {schedule.map((item) => {
              const isActive = item.id === activeLessonId;
              return (
                <React.Fragment key={item.id}>
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                      isActive ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Bell className={`h-5 w-5 ${isActive && isRinging ? 'animate-bounce' : ''}`} />
                      <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className={`text-sm ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          {item.startTime} - {item.endTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
