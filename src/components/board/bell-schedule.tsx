
'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Volume2, VolumeX } from 'lucide-react';
import * as Tone from 'tone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ka } from 'date-fns/locale';
import Image from 'next/image';

// This interface must match the one in `schema.ts`
interface ScheduleItem {
    id?: string;
    name: string;
    startTime: string;
    endTime: string;
}

interface BellScheduleProps {
  schedule: ScheduleItem[];
  logo?: string;
  schoolName: string;
  bellSoundUrl?: string;
  bellVolume?: number; 
}

export function BellSchedule({ schedule, logo, schoolName, bellSoundUrl, bellVolume }: BellScheduleProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isRinging, setIsRinging] = useState(false);
  const [synth, setSynth] = useState<Tone.Synth | null>(null);
  const [countdown, setCountdown] = useState<{ label: string; time: string } | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  useEffect(() => {
    setIsClient(true);
    // Initialize synth on client
    setSynth(new Tone.Synth().toDestination());
    
    // Set time on the client to avoid hydration mismatch
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!currentTime || !isClient || !schedule) {
        return;
    }
    
    const sortedSchedule = [...schedule].sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (sortedSchedule.length === 0) {
        setCountdown(null);
        setActiveLessonId(null);
        return;
    }
    
    const now = currentTime;
    const timeNowStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds();

    let activeLesson: ScheduleItem | null = null;
    let nextLesson: ScheduleItem | null = null;

    for (const item of sortedSchedule) {
      if (timeNowStr >= item.startTime && timeNowStr < item.endTime) {
        activeLesson = item;
        break;
      }
    }
    
    if (!activeLesson) {
      for (const item of sortedSchedule) {
        if (item.startTime > timeNowStr) {
          nextLesson = item;
          break;
        }
      }
      if (!nextLesson && sortedSchedule.length > 0) {
        nextLesson = sortedSchedule[0];
      }
    }

    setActiveLessonId(activeLesson ? activeLesson.id || null : null);

    // Countdown logic
    let countdownLabel = '';
    let targetTime: Date | null = null;

    if (activeLesson) {
      const [endHours, endMinutes] = activeLesson.endTime.split(':').map(Number);
      targetTime = new Date(now);
      targetTime.setHours(endHours, endMinutes, 0, 0);
      const isBreak = activeLesson.name.toLowerCase().includes('break') || activeLesson.name.toLowerCase().includes('დასვენება');
      countdownLabel = isBreak ? 'შესვენების დასრულებამდე' : 'გაკვეთილის დასრულებამდე';
    } else if (nextLesson) {
      const [startHours, startMinutes] = nextLesson.startTime.split(':').map(Number);
      targetTime = new Date(now);
      targetTime.setHours(startHours, startMinutes, 0, 0);

      if (targetTime < now) {
        targetTime.setDate(targetTime.getDate() + 1);
      }
      
      const isNextBreak = nextLesson.name.toLowerCase().includes('break') || nextLesson.name.toLowerCase().includes('დასვენება');
      countdownLabel = isNextBreak ? 'შესვენების დაწყებამდე' : 'გაკვეთილის დაწყებამდე';
    }

    if (targetTime) {
        const diff = targetTime.getTime() - now.getTime();
        if (diff >= 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);
            
            setCountdown({
                label: countdownLabel,
                time: `${hours > 0 ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`
            });
        } else {
             setCountdown(null);
        }
    } else {
        setCountdown(null);
    }
    
    // Ringing logic
    let shouldRing = false;
    if (seconds === 0) {
        for (const item of sortedSchedule) {
            if (timeNowStr === item.startTime || timeNowStr === item.endTime) {
                shouldRing = true;
                break;
            }
        }
    }

    if (shouldRing) {
      setIsRinging(true);
      if (synth && soundEnabled) {
        try {
          Tone.start();
          // This is a simple generic bell sound. You can customize this.
          synth.triggerAttackRelease("C5", "8n", Tone.now());
        } catch (e) {
          console.error("Could not play sound:", e);
        }
      }
      setTimeout(() => setIsRinging(false), 5000); // Ring for 5 seconds
    }

  }, [currentTime, schedule, synth, isClient, soundEnabled]);

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm:ss');
  };
  
  const formatDate = (date: Date) => {
    return format(date, "EEEE, dd MMMM, yyyy", { locale: ka });
  }

  return (
    <Card className="flex flex-col h-full w-full rounded-none border-0 md:border-r bg-card/50 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-4">
          {logo && <Image src={logo} alt={schoolName} width={48} height={48} className="rounded-md"/>}
          <CardTitle className="font-headline text-xl tracking-tight">{schoolName}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)}>
          {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-0 min-h-0">
        <div className="p-4 text-center border-b border-border/50">
          <p className="font-mono text-4xl font-bold text-primary tracking-widest">
            {isClient && currentTime ? formatTime(currentTime) : '00:00:00'}
          </p>
          <p className="text-sm text-muted-foreground">{isClient && currentTime ? formatDate(currentTime) : ' '}</p>
        </div>

        {countdown && (
          <div className="p-3 text-center border-b border-border/50 bg-muted/30">
            <p className="text-sm text-muted-foreground font-medium">{countdown.label}</p>
            <p className="font-mono text-3xl font-bold text-accent tracking-wider">
              {countdown.time}
            </p>
          </div>
        )}

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
            {schedule.length === 0 && <p className="text-center text-muted-foreground py-8">განრიგი ცარიელია.</p>}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
