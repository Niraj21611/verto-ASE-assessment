"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  employeeCreateSchema,
  type EmployeeCreateInput,
} from "@/lib/validations/employee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Props = {
  mode: "create" | "edit";
  defaultValues?: Partial<EmployeeCreateInput>;
  onSubmit: (values: EmployeeCreateInput) => Promise<void>;
  onCancel?: () => void;
};

export default function EmployeeForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmployeeCreateInput>({
    resolver: zodResolver(employeeCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      position: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset({
      name: defaultValues?.name || "",
      email: defaultValues?.email || "",
      position: defaultValues?.position || "",
    });
  }, [defaultValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        try {
          await onSubmit(values);
          if (mode === "create") reset({ name: "", email: "", position: "" });
        } catch{
          toast.error("Something went wrong");
        }
      })}
      className="space-y-4"
      noValidate
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Jane Doe" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="jane@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          placeholder="Software Engineer"
          {...register("position")}
        />
        {errors.position && (
          <p className="text-sm text-destructive">{errors.position.message}</p>
        )}
      </div>
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button className="cursor-pointer" type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button className="cursor-pointer" type="submit" disabled={isSubmitting}>
          {mode === "create" ? "Add Employee" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
