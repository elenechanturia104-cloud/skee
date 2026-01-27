'use client';

import { useChronoBoard } from '@/hooks/use-chronoboard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, PlusCircle, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { BoardItem } from '@/lib/types';
import Image from 'next/image';

const contentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  imageHint: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentSchema>;

function ContentForm({ item, onSave }: { item?: BoardItem; onSave: (data: BoardItem) => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: item || { title: '', description: '', imageUrl: '', imageHint: '' },
  });

  const onSubmit = (data: ContentFormValues) => {
    onSave({ ...data, id: item?.id || new Date().getTime().toString() });
    toast({
      title: `Content ${item ? 'Updated' : 'Added'}`,
      description: 'The information board has been updated.',
    });
    setOpen(false);
    if (!item) {
        form.reset({ title: '', description: '', imageUrl: '', imageHint: '' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {item ? (
          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
        ) : (
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Content</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">{item ? 'Edit' : 'Add'} Content</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="imageHint" render={({ field }) => (
                <FormItem><FormLabel>Image Hint (for AI)</FormLabel><FormControl><Input placeholder="e.g. team meeting" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export function ContentManager() {
  const { boardItems, setBoardItems } = useChronoBoard();
  const { toast } = useToast();

  const handleSave = (data: BoardItem) => {
    const existingIndex = boardItems.findIndex(item => item.id === data.id);
    if (existingIndex > -1) {
      const newItems = [...boardItems];
      newItems[existingIndex] = data;
      setBoardItems(newItems);
    } else {
      setBoardItems([...boardItems, data]);
    }
  };

  const handleDelete = (id: string) => {
    setBoardItems(boardItems.filter(item => item.id !== id));
    toast({
      title: 'Content Deleted',
      variant: 'destructive',
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Content Management</CardTitle>
          <CardDescription>Manage the slides on the information board.</CardDescription>
        </div>
        <ContentForm onSave={handleSave} />
      </CardHeader>
      <CardContent className="space-y-4">
        {boardItems.map(item => (
          <Card key={item.id} className="flex items-center p-4">
            <Image src={item.imageUrl} alt={item.title} width={80} height={60} className="rounded-md object-cover mr-4" />
            <div className="flex-grow">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <ContentForm item={item} onSave={handleSave} />
              <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}
        {boardItems.length === 0 && <p className="text-center text-muted-foreground py-8">No content items yet. Add one to get started!</p>}
      </CardContent>
    </Card>
  );
}
