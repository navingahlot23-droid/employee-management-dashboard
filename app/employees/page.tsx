import Link from "next/link";
import EmployeeTable from "./EmployeeTable";
import { EmployeeProvider } from "@/context/EmployeeContext";
import EmployeeStats from "./EmployeeStats";
import EmployeeHeader from "./EmployeeHeader";
import { Employee } from "@/types/employee";

type EmployeeResponse = {
  users: Employee[];
};

async function getEmployees(): Promise<Employee[]> {
  const response = await fetch("https://dummyjson.com/users?limit=10");

  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }

  const data: EmployeeResponse = await response.json();

  return data.users;
}

export default async function EmployeesPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employees</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your company's employees.
            </p>
          </div>
          <EmployeeHeader />
        </div>

        <EmployeeStats />
        <div className="mb-4 flex items-center justify-between">
  <h2 className="text-lg font-semibold text-gray-900">
    Employee List
  </h2>

  <Link
    href="/employees/new"
    className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
  >
    + Add Employee
  </Link>
</div>
        <EmployeeTable />
      </div>
    </main>
  );
}
