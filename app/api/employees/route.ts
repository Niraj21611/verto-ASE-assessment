import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { employeeCreateSchema } from "@/lib/validations/employee";

// Ensure the SQLite table exists (for environments without migrations)
async function ensureDb() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Employee" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "position" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );
  `);
}

export async function GET() {
  await ensureDb();
  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(employees);
}

export async function POST(req: Request) {
  await ensureDb();
  const json = await req.json();
  const parse = employeeCreateSchema.safeParse(json);

  if (!parse.success) {
    return NextResponse.json(
      { errors: parse.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const created = await prisma.employee.create({
      data: parse.data,
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
