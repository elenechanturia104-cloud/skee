'use client';

import { useChronoBoard } from '@/hooks/use-chronoboard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const scheduleSchema = z.object({
  schedule: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, 'Name is required'),
      startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
      endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
    })
  ),
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

export function ScheduleManager() {
  const { schedule, setSchedule } = useChronoBoard();
  const { toast } = useToast();

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    values: {
      schedule: schedule,
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'schedule',
  });

  const onSubmit = (data: ScheduleFormValues) => {
    // Sort by start time before saving
    const sortedSchedule = [...data.schedule].sort((a, b) => a.startTime.localeCompare(b.startTime));
    setSchedule(sortedSchedule);
    toast({
      title: 'Schedule Saved',
      description: 'The bell schedule has been updated successfully.',
    });
  };

  const addNewItem = () => {
    append({
        id: new Date().getTime().toString(),
        name: 'New Lesson',
        startTime: '00:00',
        endTime: '00:00',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Schedule Management</CardTitle>
        <CardDescription>Add, edit, or remove bell schedule times.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="border rounded-md">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Lesson Name</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.map((field, index) => (
                    <TableRow key={field.id}>
                        <TableCell>
                        <FormField control={form.control} name={`schedule.${index}.name`} render={({ field }) => (
                            <FormItem><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                        </TableCell>
                        <TableCell>
                        <FormField control={form.control} name={`schedule.${index}.startTime`} render={({ field }) => (
                            <FormItem><FormControl><Input type="time" {...field} /></FormControl></FormItem>
                        )} />
                        </TableCell>
                        <TableCell>
                        <FormField control={form.control} name={`schedule.${index}.endTime`} render={({ field }) => (
                            <FormItem><FormControl><Input type="time" {...field} /></FormControl></FormItem>
                        )} />
                        </TableCell>
                        <TableCell className="text-right">
                        <Button variant="ghost" size="icon" type="button" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            <div className="mt-4 flex justify-between">
                <Button variant="outline" type="button" onClick={addNewItem}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
                <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
