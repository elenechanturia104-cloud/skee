'use client';
import { useChronoBoard } from '@/hooks/use-chronoboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export function LogViewer() {
  const { logs, clearLogs } = useChronoBoard();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">ადმინის ცვლილებების ისტორია</CardTitle>
        <CardDescription>ადმინისტრირების პანელში განხორციელებული ცვლილებების ჩანაწერი.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">დრო</TableHead>
                <TableHead>მოქმედება</TableHead>
                <TableHead>დეტალები</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>{format(new Date(log.timestamp), "Pp")}</TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{log.details}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    ჩანაწერები ჯერ არ არის.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={logs.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" /> ისტორიის გასუფთავება
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>დარწმუნებული ხართ?</AlertDialogTitle>
              <AlertDialogDescription>
                ამ მოქმედების გაუქმება შეუძლებელია. ეს სამუდამოდ წაშლის ყველა ჩანაწერს.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>გაუქმება</AlertDialogCancel>
              <AlertDialogAction onClick={clearLogs}>გაგრძელება</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
