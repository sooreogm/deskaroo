import { useState } from 'react';
import { Pencil, Plus, QrCode, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import DeskQRCode from '@/components/booking/DeskQRCode';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Desk, Room } from '@/types';
import {
  createDeskRequest,
  createRoomRequest,
  deleteDeskRequest,
  deleteRoomRequest,
  fetchDesks,
  fetchRooms,
  updateDeskRequest,
  updateRoomRequest,
} from '@/lib/api';
import { toast } from 'sonner';

type DeskFormState = {
  name: string;
  roomId: string;
  status: 'available' | 'maintenance';
  type: NonNullable<Desk['type']>;
};

const defaultDeskForm = (roomId = ''): DeskFormState => ({
  name: '',
  roomId,
  status: 'available',
  type: 'standard',
});

const AdminRooms = () => {
  const queryClient = useQueryClient();
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [deskDialogOpen, setDeskDialogOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [editDesk, setEditDesk] = useState<Desk | null>(null);
  const [qrDesk, setQrDesk] = useState<Desk | null>(null);
  const [roomForm, setRoomForm] = useState({ name: '', floor: 1, capacity: 10 });
  const [deskForm, setDeskForm] = useState<DeskFormState>(defaultDeskForm());

  const { data: rooms = [] } = useQuery({
    queryKey: ['admin-rooms'],
    queryFn: async () => {
      const data = await fetchRooms();
      return data.sort((a, b) => a.floor - b.floor || a.name.localeCompare(b.name));
    },
  });

  const { data: desks = [] } = useQuery({
    queryKey: ['admin-desks'],
    queryFn: async () => {
      const data = await fetchDesks();
      return data.sort((a, b) => a.name.localeCompare(b.name));
    },
  });

  const saveRoomMutation = useMutation({
    mutationFn: async () => {
      if (!roomForm.name.trim()) {
        throw new Error('Room name is required');
      }

      if (editRoom) {
        return updateRoomRequest(editRoom.id, {
          name: roomForm.name.trim(),
          floor: roomForm.floor,
          capacity: roomForm.capacity,
        });
      }

      return createRoomRequest({
        name: roomForm.name.trim(),
        floor: roomForm.floor,
        capacity: roomForm.capacity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      toast.success(editRoom ? 'Room updated' : 'Room created');
      setRoomDialogOpen(false);
      setEditRoom(null);
      setRoomForm({ name: '', floor: 1, capacity: 10 });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteRoomMutation = useMutation({
    mutationFn: async (roomId: string) => {
      await deleteRoomRequest(roomId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['admin-desks'] });
      queryClient.invalidateQueries({ queryKey: ['desks'] });
      toast.success('Room deleted');
    },
    onError: () => toast.error('Failed to delete room'),
  });

  const saveDeskMutation = useMutation({
    mutationFn: async () => {
      if (!deskForm.name.trim() || !deskForm.roomId) {
        throw new Error('Desk name and room are required');
      }

      if (editDesk) {
        return updateDeskRequest(editDesk.id, {
          name: deskForm.name.trim(),
          roomId: deskForm.roomId,
          status: deskForm.status,
          type: deskForm.type,
        });
      }

      return createDeskRequest({
        name: deskForm.name.trim(),
        roomId: deskForm.roomId,
        status: deskForm.status,
        type: deskForm.type,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-desks'] });
      queryClient.invalidateQueries({ queryKey: ['desks'] });
      toast.success(editDesk ? 'Desk updated' : 'Desk created');
      setDeskDialogOpen(false);
      setEditDesk(null);
      setDeskForm(defaultDeskForm(rooms[0]?.id ?? ''));
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteDeskMutation = useMutation({
    mutationFn: async (deskId: string) => {
      await deleteDeskRequest(deskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-desks'] });
      queryClient.invalidateQueries({ queryKey: ['desks'] });
      toast.success('Desk deleted');
    },
    onError: () => toast.error('Failed to delete desk'),
  });

  const openRoomDialog = (room?: Room) => {
    if (room) {
      setEditRoom(room);
      setRoomForm({ name: room.name, floor: room.floor, capacity: room.capacity });
    } else {
      setEditRoom(null);
      setRoomForm({ name: '', floor: 1, capacity: 10 });
    }

    setRoomDialogOpen(true);
  };

  const openDeskDialog = (desk?: Desk) => {
    if (desk) {
      setEditDesk(desk);
      setDeskForm({
        name: desk.name,
        roomId: desk.roomId,
        status: desk.status === 'maintenance' ? 'maintenance' : 'available',
        type: desk.type ?? 'standard',
      });
    } else {
      setEditDesk(null);
      setDeskForm(defaultDeskForm(rooms[0]?.id ?? ''));
    }

    setDeskDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.12fr,0.88fr]">
          <div className="shell-panel p-6 sm:p-8">
            <span className="page-eyebrow">Rooms & Desks</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Manage desk inventory and QR assignments
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Keep the office layout simple and accurate: rooms hold desks, desks hold QR codes, and staff bookings stay tied to the physical workspace.
            </p>
          </div>

          <div className="ink-panel p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-white">Desk setup rules</h2>
            <div className="mt-6 space-y-4">
              {[
                'Rooms group desks by office area or floor.',
                'Each desk needs its own QR code preview.',
                'Maintenance desks stay visible but cannot be booked.',
              ].map((item, index) => (
                <div key={item} className="flex gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary text-sm font-semibold text-black">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-white/68">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="shell-panel p-5">
            <p className="text-sm text-muted-foreground">Rooms</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{rooms.length}</p>
          </div>
          <div className="shell-panel p-5">
            <p className="text-sm text-muted-foreground">Desks</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{desks.length}</p>
          </div>
          <div className="shell-panel p-5">
            <p className="text-sm text-muted-foreground">Maintenance desks</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              {desks.filter((desk) => desk.status === 'maintenance').length}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex gap-3">
            <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openRoomDialog()} className="rounded-full px-5">
                  <Plus className="mr-2 h-4 w-4" /> Add Room
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[1.75rem] border border-black/10 bg-white p-0 shadow-[0_32px_90px_-48px_rgba(0,0,0,0.35)] sm:max-w-lg">
                <div className="p-6 sm:p-7">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
                    {editRoom ? 'Edit Room' : 'New Room'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label className="mb-2 block">Name</Label>
                    <Input
                      className="h-11 rounded-2xl border-black/10 bg-white/80"
                      value={roomForm.name}
                      onChange={(event) => setRoomForm((current) => ({ ...current, name: event.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-2 block">Floor</Label>
                      <Input
                        className="h-11 rounded-2xl border-black/10 bg-white/80"
                        type="number"
                        value={roomForm.floor}
                        onChange={(event) => setRoomForm((current) => ({ ...current, floor: Number(event.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label className="mb-2 block">Capacity</Label>
                      <Input
                        className="h-11 rounded-2xl border-black/10 bg-white/80"
                        type="number"
                        value={roomForm.capacity}
                        onChange={(event) => setRoomForm((current) => ({ ...current, capacity: Number(event.target.value) }))}
                      />
                    </div>
                  </div>
                  <Button className="h-11 w-full rounded-full" onClick={() => saveRoomMutation.mutate()} disabled={saveRoomMutation.isPending}>
                    {saveRoomMutation.isPending ? 'Saving...' : 'Save Room'}
                  </Button>
                </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={deskDialogOpen} onOpenChange={setDeskDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openDeskDialog()} variant="outline" className="rounded-full border-black/10 bg-white/80 px-5">
                  <Plus className="mr-2 h-4 w-4" /> Add Desk
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[1.75rem] border border-black/10 bg-white p-0 shadow-[0_32px_90px_-48px_rgba(0,0,0,0.35)] sm:max-w-lg">
                <div className="p-6 sm:p-7">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
                    {editDesk ? 'Edit Desk' : 'New Desk'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label className="mb-2 block">Name</Label>
                    <Input
                      className="h-11 rounded-2xl border-black/10 bg-white/80"
                      value={deskForm.name}
                      onChange={(event) => setDeskForm((current) => ({ ...current, name: event.target.value }))}
                      placeholder="Desk A1"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Room</Label>
                    <Select
                      value={deskForm.roomId}
                      onValueChange={(value) => setDeskForm((current) => ({ ...current, roomId: value }))}
                    >
                      <SelectTrigger className="h-11 rounded-2xl border-black/10 bg-white/80">
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-black/10">
                        {rooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-2 block">Status</Label>
                      <Select
                        value={deskForm.status}
                        onValueChange={(value) =>
                          setDeskForm((current) => ({ ...current, status: value as DeskFormState['status'] }))
                        }
                      >
                        <SelectTrigger className="h-11 rounded-2xl border-black/10 bg-white/80">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-black/10">
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-2 block">Desk Type</Label>
                      <Select
                        value={deskForm.type}
                        onValueChange={(value) =>
                          setDeskForm((current) => ({ ...current, type: value as DeskFormState['type'] }))
                        }
                      >
                        <SelectTrigger className="h-11 rounded-2xl border-black/10 bg-white/80">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-black/10">
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="standing">Standing</SelectItem>
                          <SelectItem value="corner">Corner</SelectItem>
                          <SelectItem value="huddle">Huddle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="h-11 w-full rounded-full" onClick={() => saveDeskMutation.mutate()} disabled={saveDeskMutation.isPending}>
                    {saveDeskMutation.isPending ? 'Saving...' : 'Save Desk'}
                  </Button>
                </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="shell-panel border-0 bg-white/90 shadow-none">
          <CardHeader className="border-b border-black/8 pb-5">
            <CardTitle className="text-xl tracking-tight">All Rooms ({rooms.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Desks</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{room.floor}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>{desks.filter((desk) => desk.roomId === room.id).length}</TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button variant="ghost" size="icon" className="rounded-full border border-black/10 bg-white/80" onClick={() => openRoomDialog(room)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full border border-black/10 bg-white/80" onClick={() => deleteRoomMutation.mutate(room.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {rooms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      No rooms yet. Create your first room.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shell-panel border-0 bg-white/90 shadow-none">
          <CardHeader className="border-b border-black/8 pb-5">
            <CardTitle className="text-xl tracking-tight">Desk Inventory ({desks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Desk</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>QR Code</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {desks.map((desk) => {
                  const room = rooms.find((entry) => entry.id === desk.roomId);
                  const status = desk.status === 'maintenance' ? 'maintenance' : 'available';

                  return (
                    <TableRow key={desk.id}>
                      <TableCell className="font-medium">{desk.name}</TableCell>
                      <TableCell>{room?.name ?? 'Unknown room'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={status === 'maintenance' ? 'destructive' : 'secondary'}
                          className={status === 'maintenance' ? 'rounded-full px-3 py-1' : 'rounded-full px-3 py-1 bg-muted text-foreground'}
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{desk.type ?? 'standard'}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-black/10 bg-white/80"
                          onClick={() => setQrDesk(desk)}
                        >
                          <QrCode className="mr-2 h-4 w-4" /> View QR
                        </Button>
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button variant="ghost" size="icon" className="rounded-full border border-black/10 bg-white/80" onClick={() => openDeskDialog(desk)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full border border-black/10 bg-white/80" onClick={() => deleteDeskMutation.mutate(desk.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {desks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No desks yet. Add a desk to start assigning QR codes.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={!!qrDesk} onOpenChange={(open) => !open && setQrDesk(null)}>
          <DialogContent className="rounded-[1.75rem] border border-black/10 bg-white p-0 shadow-[0_32px_90px_-48px_rgba(0,0,0,0.35)] sm:max-w-md">
            <div className="p-6 sm:p-7">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
                {qrDesk?.name} QR Code
              </DialogTitle>
            </DialogHeader>
            {qrDesk && (
              <div className="space-y-4 pt-4">
                <DeskQRCode deskId={qrDesk.id} deskName={qrDesk.name} size={220} />
                <p className="text-center text-sm text-muted-foreground">
                  Attach this QR code to the physical desk so staff can scan it to check in and check out.
                </p>
              </div>
            )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminRooms;
