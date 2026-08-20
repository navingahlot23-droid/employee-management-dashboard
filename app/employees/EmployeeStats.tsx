"use client";

import { useEmployees } from "@/context/EmployeeContext";

export default function EmployeeStats() {
  const {
    totalEmployees,
    activeEmployees,
    departmentCount,
  } = useEmployees();

  const stats = [
    {
      label: "Total Employees",
      value: totalEmployees,
    },
    {
      label: "Active Employees",
      value: activeEmployees,
    },
    {
      label: "Departments",
      value: departmentCount,
    },
  ];

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-gray-500">
            {stat.label}
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}