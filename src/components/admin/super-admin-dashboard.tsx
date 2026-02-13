
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';
import { SchoolSchema } from '@/lib/schema';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import placeholderImagesData from '@/lib/placeholder-images.json';

type SchoolFormData = z.infer<typeof SchoolSchema>;
type School = SchoolFormData & { id: string };

const { placeholderImages } = placeholderImagesData;

const defaultSchoolValues: SchoolFormData = {
  name: '',
  logo: '',
  adminPassword: '',
  design: { primaryColor: '#4B0082', backgroundColor: '#E6E6FA', accentColor: '#8F00FF' },
  schedule: [],
  bellSettings: { sound: 'school', volume: 50 },
  infoBoard: { content: '' },
  refreshInterval: '10',
};

export default function SuperAdminDashboard() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);

  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } = useForm<SchoolFormData>({
    resolver: zodResolver(SchoolSchema),
    defaultValues: defaultSchoolValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule",
  });

  const logoUrl = watch('logo');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'schools'), (snapshot) => {
      const schoolsData: School[] = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as SchoolFormData) }));
      setSchools(schoolsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isNew) {
      reset(defaultSchoolValues);
    } else if (selectedSchoolId) {
      const school = schools.find(s => s.id === selectedSchoolId);
      if (school) {
        const schoolWithDefaults = {
          ...defaultSchoolValues,
          ...school,
          design: { ...defaultSchoolValues.design, ...school.design },
          bellSettings: { ...defaultSchoolValues.bellSettings, ...school.bellSettings },
          infoBoard: { ...defaultSchoolValues.infoBoard, ...school.infoBoard },
        };
        reset(schoolWithDefaults);
      }
    } else {
      reset(defaultSchoolValues);
    }
  }, [selectedSchoolId, schools, reset, isNew]);

  const handleSave = async (data: SchoolFormData) => {
    if (isNew) {
      await addDoc(collection(db, 'schools'), data);
    } else if (selectedSchoolId) {
      const schoolRef = doc(db, 'schools', selectedSchoolId);
      await updateDoc(schoolRef, data);
    }
    handleCancel();
  };

  const handleAddNew = () => {
    setSelectedSchoolId(null);
    setIsNew(true);
  };

  const handleCancel = () => {
    setSelectedSchoolId(null);
    setIsNew(false);
    reset(defaultSchoolValues);
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  const isEditing = selectedSchoolId || isNew;
  const currentSchoolName = isNew ? "New School" : schools.find(s => s.id === selectedSchoolId)?.name;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>

      {!isEditing ? (
         <Card>
            <CardHeader>
              <CardTitle>Select or Create a School</CardTitle>
            </CardHeader>
            <CardContent>
                <Select onValueChange={setSelectedSchoolId} value={selectedSchoolId || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a school to edit" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map(school => (
                      <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddNew} className="mt-4">Add New School</Button>
            </CardContent>
          </Card>
      ) : (
        <Card>
            <CardHeader>
                <CardTitle>{isNew ? "Add New School" : `Editing: ${currentSchoolName}`}</CardTitle>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                  <div className="space-y-2">
                    <Label>School Name</Label>
                    <Input {...register('name')} />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 bg-cover bg-center border rounded-md" style={{ backgroundImage: `url(${logoUrl})` }}></div>
                        <div className="flex-1">
                            <Label>Logo URL</Label>
                            <Input {...register('logo')} />
                             <Select onValueChange={(value) => setValue('logo', value)}>
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Or choose a placeholder" />
                                </SelectTrigger>
                                <SelectContent>
                                    {placeholderImages.map((image) => (
                                        <SelectItem key={image.id} value={image.imageUrl}>
                                            {image.imageHint}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <Label>Admin Password</Label>
                    <Input type="password" {...register('adminPassword')} />
                  </div>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold mb-2">Design</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Primary Color</Label>
                        <Input type="color" {...register('design.primaryColor')} />
                      </div>
                      <div>
                        <Label>Background Color</Label>
                        <Input type="color" {...register('design.backgroundColor')} />
                      </div>
                      <div>
                        <Label>Accent Color</Label>
                        <Input type="color" {...register('design.accentColor')} />
                      </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-2">Schedule</h3>
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2 p-2 border rounded-md">
                            <Input {...register(`schedule.${index}.name`)} placeholder="Event Name" className="flex-1" />
                            <Input {...register(`schedule.${index}.startTime`)} placeholder="Start (HH:MM)" />
                            <Input {...register(`schedule.${index}.endTime`)} placeholder="End (HH:MM)" />
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>X</Button>
                        </div>
                    ))}
                  </div>
                  <Button type="button" onClick={() => append({ id: `${Date.now()}`, name: '', startTime: '', endTime: '' })} className="mt-2">Add Event</Button>
                </section>
                
                <section>
                   <h3 className="text-lg font-semibold mb-2">Information Board</h3>
                   <Textarea {...register('infoBoard.content')} placeholder="Enter content for the information board..." />
                </section>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </div>
            </form>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
