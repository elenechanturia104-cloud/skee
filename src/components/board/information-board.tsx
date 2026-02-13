
'use client';

import { Card, CardContent } from '@/components/ui/card';

interface InformationBoardProps {
  content: string;
}

export function InformationBoard({ content }: InformationBoardProps) {
  if (!content) {
    return (
        <div className="flex h-full w-full items-center justify-center bg-background p-8">
            <Card className="w-full max-w-4xl">
                <CardContent className="p-10 text-center">
                    <h2 className="text-2xl font-headline font-semibold text-muted-foreground">საჩვენებელი ინფორმაცია არ არის</h2>
                    <p className="text-muted-foreground mt-2">ადმინისტრატორს ჯერ არ დაუმატებია შიგთავსი დაფაზე.</p>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-4xl">
            <CardContent className="p-10">
                <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
                    {content}
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
