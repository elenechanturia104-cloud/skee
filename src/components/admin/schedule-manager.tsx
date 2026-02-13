'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect } from 'react';

// Inline type to fix import errors
interface ScheduleItem {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
}

const scheduleSchema = z.object({
  schedule: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, 'სახელი სავალდებულოა'),
      startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'დროის არასწორი ფორმატი (სს:წთ)'),
      endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'დროის არასწორი ფორმატი (სს:წთ)'),
    })
  ),
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

interface ScheduleManagerProps {
  schedule: ScheduleItem[];
  schoolId: string;
}

export function ScheduleManager({ schedule, schoolId }: ScheduleManagerProps) {
  const { toast } = useToast();

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      schedule: [],
    },
  });

  useEffect(() => {
    form.reset({ schedule });
  }, [schedule, form]);
  
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'schedule',
  });

  const onSubmit = async (data: ScheduleFormValues) => {
    const schoolRef = doc(db, 'schools', schoolId);
    try {
      await updateDoc(schoolRef, { schedule: data.schedule });
      toast({
        title: 'განრიგი შენახულია',
        description: 'ზარის განრიგი წარმატებით განახლდა.',
      });
    } catch (error) {
        console.error("Error updating schedule:", error);
        toast({
            variant: 'destructive',
            title: 'Error saving changes',
            description: 'There was an error while saving the schedule.',
          });
    }
  };

  const addNewItem = () => {
    append({
        id: new Date().getTime().toString(),
        name: 'ახალი პერიოდი',
        startTime: '00:00',
        endTime: '00:00',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">განრიგის მართვა</CardTitle>
        <CardDescription>ზარის განრიგის დროების დამატება, რედაქტირება, წაშლა და გადაადგილება.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="border rounded-md">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>დასახელება</TableHead>
                    <TableHead>დაწყების დრო</TableHead>
                    <TableHead>დასრულების დრო</TableHead>
                    <TableHead className="text-right w-[150px]">მოქმედებები</TableHead>
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
                          <Button variant="ghost" size="icon" type="button" onClick={() => move(index, index - 1)} disabled={index === 0}>
                              <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" type="button" onClick={() => move(index, index + 1)} disabled={index === fields.length - 1}>
                              <ArrowDown className="h-4 w-4" />
                          </Button>
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
                    <PlusCircle className="mr-2 h-4 w-4" /> ერთეულის დამატება
                </Button>
                <Button type="submit">ცვლილებების შენახვა</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
