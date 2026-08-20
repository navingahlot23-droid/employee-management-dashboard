"use client";

import Link from "next/link";
import { use } from "react";
import { useEmployees } from "@/context/EmployeeContext";

export default function EmployeeDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const employeeId = Number(slug.split("-")[0]);

  const { allEmployees, loading, error } = useEmployees();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-500">Loading employee...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm font-medium text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  const employee = allEmployees.find((item) => item.id === employeeId);

  if (!employee) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">
            Employee not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The employee you're looking for doesn't exist.
          </p>

          <Link
            href="/employees"
            className="mt-5 inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Back to Employees
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Back */}
        <div className="mb-6">
          <Link
            href="/employees"
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Back to Employees
          </Link>
        </div>

        {/* Profile */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="bg-gray-900 px-6 py-8 text-white">
            <div className="flex items-center gap-5">
              <img
                src={employee.image || "https://dummyjson.com/icon/default/128"}
                alt={`${employee.firstName} ${employee.lastName}`}
                className="h-20 w-20 rounded-full border-4 border-white/20 object-cover"
              />

              <div>
                <h1 className="text-2xl font-bold">
                  {employee.firstName} {employee.lastName}
                </h1>

                <p className="mt-1 text-gray-300">{employee.company.title}</p>

                <p className="mt-1 text-sm text-gray-400">
                  {employee.company.department}
                </p>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Employee Information
            </h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {/* Email */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Email
                </p>

                <p className="mt-1 text-sm text-gray-700">{employee.email}</p>
              </div>

              {/* Phone */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Phone
                </p>

                <p className="mt-1 text-sm text-gray-700">{employee.phone}</p>
              </div>

              {/* Username */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Username
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {employee.username}
                </p>
              </div>

              {/* Age */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Age
                </p>

                <p className="mt-1 text-sm text-gray-700">{employee.age}</p>
              </div>

              {/* Gender */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Gender
                </p>

                <p className="mt-1 text-sm capitalize text-gray-700">
                  {employee.gender}
                </p>
              </div>

              {/* Company */}
              {/* <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Company
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {employee.company.name}
                </p>
              </div> */}

              {/* Status */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Status
                </p>

                <span
                  className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    employee.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {employee.status}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h2 className="text-lg font-semibold text-gray-900">Address</h2>

              <p className="mt-3 text-sm text-gray-600">
                {employee.address.address}
                <br />
                {employee.address.city}, {employee.address.state}
                <br />
                {employee.address.country}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
