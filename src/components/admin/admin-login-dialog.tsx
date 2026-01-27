'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChronoBoard } from '@/hooks/use-chronoboard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const pinSchema = z.object({
  pin: z.string().min(4, 'პინ-კოდი უნდა შედგებოდეს 4 ციფრისგან').max(4, 'პინ-კოდი უნდა შედგებოდეს 4 ციფრისგან'),
});

type PinFormValues = z.infer<typeof pinSchema>;

interface AdminLoginDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminLoginDialog({ children, open, onOpenChange }: AdminLoginDialogProps) {
  const { login } = useChronoBoard();
  const { toast } = useToast();
  const form = useForm<PinFormValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: { pin: '' },
  });

  const onSubmit: SubmitHandler<PinFormValues> = (data) => {
    if (!login(data.pin)) {
      toast({
        variant: 'destructive',
        title: 'ავტორიზაცია ვერ მოხერხდა',
        description: 'თქვენ მიერ შეყვანილი პინ-კოდი არასწორია.',
      });
      form.reset();
    } else {
        onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">ადმინისტრატორის წვდომა</DialogTitle>
          <DialogDescription>შეიყვანეთ 4-ნიშნა პინ-კოდი ადმინისტრირების პანელზე წვდომისთვის.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>პინ-კოდი</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      className="text-center font-mono text-2xl tracking-[1.5em]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full">
                განბლოკვა
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
