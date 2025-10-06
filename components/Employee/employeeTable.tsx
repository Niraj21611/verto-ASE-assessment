"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EmployeeForm from "./employeeForm";
import { toast } from "sonner";

type Employee = {
  id: number;
  name: string;
  email: string;
  position: string;
  createdAt: string;
  updatedAt: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function EmployeeTable() {
  const { data, error, isLoading, mutate } = useSWR<Employee[]>(
    "/api/employees",
    fetcher
  );
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState<Employee | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((e) => e.name.toLowerCase().includes(q));
  }, [data, query]);

  async function createEmployee(values: {
    name: string;
    email: string;
    position: string;
  }) {
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.message || "Failed to create employee");
    }
    await mutate();
    toast.success("Employee Added");
  }

  async function updateEmployee(
    id: number,
    values: { name: string; email: string; position: string }
  ) {
    const res = await fetch(`/api/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.message || "Failed to update employee");
    }
    await mutate();
    toast.success("Employee Updated");
  }

  async function deleteEmployee(id: number) {
    const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.message || "Failed to delete employee");
    }
    await mutate();
    toast.success("Employee Deleted");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Button
          className="cursor-pointer"
          variant="default"
          onClick={() => setAddOpen(true)}
        >
          Add Employee
        </Button>
        <div className="w-full md:max-w-sm">
          <Input
            placeholder="Search by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Position</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td className="p-3" colSpan={4}>
                    Loading...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td className="p-3 text-destructive" colSpan={4}>
                    Failed to load employees
                  </td>
                </tr>
              )}
              {!isLoading && !error && filtered.length === 0 && (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={4}>
                    No employees found
                  </td>
                </tr>
              )}
              {filtered.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="p-3">{e.name}</td>
                  <td className="p-3">{e.email}</td>
                  <td className="p-3">{e.position}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        className="cursor-pointer"
                        variant="secondary"
                        onClick={() => setEditing(e)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="cursor-pointer"
                        variant="destructive"
                        onClick={() => setDeleting(e)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            mode="create"
            onCancel={() => setAddOpen(false)}
            onSubmit={async (v) => {
              await createEmployee(v);
              setAddOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {editing && (
            <EmployeeForm
              mode="edit"
              defaultValues={{
                name: editing.name,
                email: editing.email,
                position: editing.position,
              }}
              onCancel={() => setEditing(null)}
              onSubmit={async (v) => {
                await updateEmployee(editing.id, v);
                setEditing(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete employee?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove{" "}
              {deleting?.name ? `"${deleting.name}"` : "this employee"} from the
              database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleting(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deleting) return;
                await deleteEmployee(deleting.id);
                setDeleting(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
