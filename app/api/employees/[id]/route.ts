import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { employeeUpdateSchema } from "@/lib/validations/employee";

// Helper to parse ID
function parseId(id: string) {
  const num = Number(id);
  if (!Number.isInteger(num) || num <= 0) return null;
  return num;
}

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee)
    return NextResponse.json({ message: "Not Found" }, { status: 404 });

  return NextResponse.json(employee);
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

  const json = await req.json();
  const parse = employeeUpdateSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json(
      { errors: parse.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.employee.update({
      where: { id },
      data: parse.data,
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

  try {
    await prisma.employee.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
