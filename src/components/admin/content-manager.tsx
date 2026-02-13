'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ContentManagerProps {
  infoBoard: { content: string };
  schoolId: string;
}

export function ContentManager({ infoBoard, schoolId }: ContentManagerProps) {
  const { toast } = useToast();
  const [content, setContent] = useState(infoBoard.content);

  const handleSaveChanges = async () => {
    const schoolRef = doc(db, 'schools', schoolId);
    try {
      await updateDoc(schoolRef, {
        'infoBoard.content': content,
      });
      toast({
          title: 'შიგთავსი შენახულია',
          description: 'საინფორმაციო დაფის შიგთავსი განახლდა.',
      });
    } catch (error) {
      console.error("Error updating content:", error);
      toast({
        variant: 'destructive',
        title: 'Error saving changes',
        description: 'There was an error while saving the content.',
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">შიგთავსის მართვა</CardTitle>
        <CardDescription>საინფორმაციო დაფაზე ნაჩვენები ტექსტის რედაქტირება.</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          placeholder="შეიყვანეთ ტექსტი, რომელიც გამოჩნდება საინფორმაციო დაფაზე..."
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSaveChanges}>ცვლილებების შენახვა</Button>
      </CardFooter>
    </Card>
  );
}
