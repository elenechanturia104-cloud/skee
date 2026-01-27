'use client';

import { useChronoBoard } from '@/hooks/use-chronoboard';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
import Autoplay from "embla-carousel-autoplay"

export function InformationBoard() {
  const { boardItems } = useChronoBoard();

  if (!boardItems || boardItems.length === 0) {
    return (
        <div className="flex h-full w-full items-center justify-center bg-background p-8">
            <Card className="w-full max-w-4xl">
                <CardContent className="p-10 text-center">
                    <h2 className="text-2xl font-headline font-semibold text-muted-foreground">No Information to Display</h2>
                    <p className="text-muted-foreground mt-2">The administrator has not added any content to the board yet.</p>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-8 bg-background">
      <Carousel 
        opts={{ loop: true }} 
        plugins={[Autoplay({delay: 7000})]}
        className="w-full max-w-5xl"
      >
        <CarouselContent>
          {boardItems.map((item) => (
            <CarouselItem key={item.id}>
              <Card className="overflow-hidden shadow-2xl">
                <div className="grid md:grid-cols-2">
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <h2 className="font-headline text-3xl md:text-5xl font-bold text-primary leading-tight">
                            {item.title}
                        </h2>
                        <p className="mt-4 text-lg text-foreground/80 leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                    <div className="relative min-h-[300px] md:min-h-0">
                        <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            data-ai-hint={item.imageHint}
                        />
                    </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:flex" />
        <CarouselNext className="hidden lg:flex" />
      </Carousel>
    </div>
  );
}
