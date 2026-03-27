import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/lib/api';

const AdminUsers = () => {
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchUsers,
  });
  const adminCount = users.filter((user) => user.role === 'admin').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <span className="page-eyebrow">Users</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">User Management</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">View registered staff and keep admin access easy to spot.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="shell-panel p-5">
            <p className="text-sm text-muted-foreground">Total users</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{users.length}</p>
          </div>
          <div className="shell-panel p-5">
            <p className="text-sm text-muted-foreground">Admins</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{adminCount}</p>
          </div>
          <div className="shell-panel p-5">
            <p className="text-sm text-muted-foreground">Standard users</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{users.length - adminCount}</p>
          </div>
        </div>

        <Card className="shell-panel border-0 bg-white/90 shadow-none">
          <CardHeader className="border-b border-black/8 pb-5">
            <CardTitle className="text-xl tracking-tight">All Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const role = user.role ?? 'user';
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-foreground">
                            {user.name?.slice(0, 1).toUpperCase() ?? 'U'}
                          </div>
                          <span className="whitespace-nowrap">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                      <TableCell className="whitespace-nowrap">{user.department ?? 'N/A'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={role === 'admin' ? 'default' : 'secondary'}
                          className={role === 'admin' ? 'rounded-full px-3 py-1' : 'rounded-full px-3 py-1 bg-muted text-foreground'}
                        >
                          {role}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
