import EmployeeTable from "@/components/Employee/employeeTable"

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6 md:p-10 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold text-balance">Employee Data Management</h1>
      </header>

      <EmployeeTable />
    </main>
  )
}
