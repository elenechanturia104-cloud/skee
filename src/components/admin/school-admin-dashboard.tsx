
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { SchoolSchema } from '@/lib/schema';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Define the type for a school, including its ID
type School = z.infer<typeof SchoolSchema> & { id: string };

export default function SchoolAdminDashboard({ schoolId }: { schoolId: string }) {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, control, setValue } = useForm<z.infer<typeof SchoolSchema>>({
    resolver: zodResolver(SchoolSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule",
  });

  useEffect(() => {
    const schoolRef = doc(db, 'schools', schoolId);
    const unsubscribe = onSnapshot(schoolRef, (doc) => {
      if (doc.exists()) {
        const schoolData = { id: doc.id, ...doc.data() } as School;
        setSchool(schoolData);
        setValue('name', schoolData.name);
        setValue('logo', schoolData.logo);
        setValue('design.primaryColor', schoolData.design.primaryColor);
        setValue('design.backgroundColor', schoolData.design.backgroundColor);
        setValue('design.accentColor', schoolData.design.accentColor);
        setValue('schedule', schoolData.schedule);
        setValue('bellSettings.sound', schoolData.bellSettings.sound);
        setValue('bellSettings.volume', schoolData.bellSettings.volume);
        setValue('infoBoard.content', schoolData.infoBoard.content);
        setValue('refreshInterval', schoolData.refreshInterval);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [schoolId, setValue]);

  const updateSchool = async (data: z.infer<typeof SchoolSchema>) => {
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, data);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!school) {
    return <div>School not found.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{school.name} - Admin Panel</h1>

      <Card>
        <CardHeader>
          <CardTitle>School Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(updateSchool)} className="space-y-4">
            <Input {...register('name')} placeholder="School Name" />
            <Input {...register('logo')} placeholder="Logo URL" />

            <div>
              <Label>Design</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input {...register('design.primaryColor')} placeholder="Primary Color" />
                <Input {...register('design.backgroundColor')} placeholder="Background Color" />
                <Input {...register('design.accentColor')} placeholder="Accent Color" />
              </div>
            </div>

            <div>
              <Label>Schedule</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mb-2">
                  <Input {...register(`schedule.${index}.time`)} placeholder="Time" />
                  <Input {...register(`schedule.${index}.event`)} placeholder="Event" />
                  <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>Remove</Button>
                </div>
              ))}
              <Button type="button" onClick={() => append({ time: '', event: '' })}>Add Schedule Item</Button>
            </div>

            <div>
              <Label>Bell Settings</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input {...register('bellSettings.sound')} placeholder="Bell Sound URL" />
                <Input type="number" {...register('bellSettings.volume', { valueAsNumber: true })} placeholder="Volume (0-100)" />
              </div>
            </div>

            <Input {...register('infoBoard.content')} placeholder="Information Board Content" />

            <Select onValueChange={(value) => setValue('refreshInterval', value as '5' | '10' | '20')} >
              <SelectTrigger>
                <SelectValue placeholder="Refresh Interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="20">20 minutes</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
