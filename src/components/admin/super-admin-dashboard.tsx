
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { SchoolSchema } from '@/lib/schema';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type School = z.infer<typeof SchoolSchema> & { id: string };

export default function SuperAdminDashboard() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const { register, handleSubmit, reset, control, setValue } = useForm<z.infer<typeof SchoolSchema>>({
    resolver: zodResolver(SchoolSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'schools'), (snapshot) => {
      const schoolsData: School[] = [];
      snapshot.forEach((doc) => {
        schoolsData.push({ id: doc.id, ...doc.data() } as School);
      });
      setSchools(schoolsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateSchool = async (data: z.infer<typeof SchoolSchema>) => {
    if (selectedSchool) {
      const schoolRef = doc(db, 'schools', selectedSchool.id);
      await updateDoc(schoolRef, data);
      setSelectedSchool(null); // Deselect after saving
      reset();
    }
  };

  const handleSchoolSelect = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId);
    if (school) {
        setSelectedSchool(school);
        setValue('name', school.name);
        setValue('logo', school.logo);
        setValue('design.primaryColor', school.design.primaryColor);
        setValue('design.backgroundColor', school.design.backgroundColor);
        setValue('design.accentColor', school.design.accentColor);
        setValue('schedule', school.schedule);
        setValue('bellSettings.sound', school.bellSettings.sound);
        setValue('bellSettings.volume', school.bellSettings.volume);
        setValue('infoBoard.content', school.infoBoard.content);
        setValue('refreshInterval', school.refreshInterval);
    }
  };

  if (loading) {
    return <div>Loading schools...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Select a School to Manage</CardTitle>
        </CardHeader>
        <CardContent>
            <Select onValueChange={handleSchoolSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a school" />
              </SelectTrigger>
              <SelectContent>
                {schools.map(school => (
                  <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </CardContent>
      </Card>

      {selectedSchool && (
        <Card>
            <CardHeader>
                <CardTitle>Editing: {selectedSchool.name}</CardTitle>
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

                <Select onValueChange={(value) => setValue('refreshInterval', value as '5' | '10' | '20')} defaultValue={selectedSchool.refreshInterval}>
                    <SelectTrigger>
                        <SelectValue placeholder="Refresh Interval" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="20">20 minutes</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex gap-2">
                <Button type="submit">Save Changes</Button>
                <Button variant="outline" onClick={() => { setSelectedSchool(null); reset(); }}>Cancel</Button>
                </div>
            </form>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
