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

  const watchedValues = form.watch();

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
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-headline">{item ? 'Edit' : 'Add'} Content</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                        <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="imageHint" render={({ field }) => (
                        <FormItem><FormLabel>Image Hint (for AI)</FormLabel><FormControl><Input placeholder="e.g. team meeting" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <DialogFooter className="pt-4">
                    <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                    <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
                </Form>
            </div>
            <div className="flex flex-col gap-2">
                <h4 className="font-medium text-center text-sm text-muted-foreground">Live Preview</h4>
                <Card className="overflow-hidden shadow-lg w-full">
                    <div className="grid grid-cols-1">
                        <div className="relative h-48 bg-muted">
                            {watchedValues.imageUrl && !form.formState.errors.imageUrl ? (
                                <Image
                                    src={watchedValues.imageUrl}
                                    alt={watchedValues.title || 'Image preview'}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                    <p className="text-muted-foreground text-xs p-4 text-center">A valid image URL will be shown here</p>
                                </div>
                            )}
                        </div>
                        <div className="p-6 flex flex-col justify-center">
                            <h2 className="font-headline text-2xl font-bold text-primary leading-tight">
                                {watchedValues.title || 'Your Title'}
                            </h2>
                            <p className="mt-2 text-base text-foreground/80 leading-relaxed">
                                {watchedValues.description || 'Your description will appear here.'}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


export function ContentManager() {
  const { boardItems, setBoardItems, addLog } = useChronoBoard();
  const { toast } = useToast();

  const handleSave = (data: BoardItem) => {
    const existingIndex = boardItems.findIndex(item => item.id === data.id);
    if (existingIndex > -1) {
      const newItems = [...boardItems];
      newItems[existingIndex] = data;
      setBoardItems(newItems);
      addLog('Content Updated', `Edited item "${data.title}".`);
    } else {
      setBoardItems([...boardItems, data]);
      addLog('Content Added', `Added new item "${data.title}".`);
    }
  };

  const handleDelete = (id: string) => {
    const itemToDelete = boardItems.find((item) => item.id === id);
    setBoardItems(boardItems.filter(item => item.id !== id));
    if (itemToDelete) {
        addLog('Content Deleted', `Deleted item "${itemToDelete.title}".`);
    }
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
