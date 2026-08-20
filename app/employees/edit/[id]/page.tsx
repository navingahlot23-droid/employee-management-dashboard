"use client";

import { FormEvent, useEffect, useState } from "react";

import Link from "next/link";

import { useEmployees } from "@/context/EmployeeContext";
import { Employee } from "@/types/employee";

export default function EditEmployee({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const {
    allEmployees,
    setEmployees,
    setAllEmployees,
    departments,
    loading: employeesLoading,
  } = useEmployees();

  const [employee, setEmployee] = useState<Employee | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadEmployee() {
      const { id } = await params;

      const employeeId = Number(id);

      /*
       * Wait for the EmployeeContext to finish loading.
       */
      if (employeesLoading) {
        return;
      }

      /*
       * Always search allEmployees.
       *
       * This is important because the employee may not
       * be on the current pagination page.
       */
      const currentEmployee = allEmployees.find(
        (item) => item.id === employeeId
      );

      if (!currentEmployee) {
        setMessage("Employee not found.");
        setLoading(false);
        return;
      }

      setEmployee(currentEmployee);
      setUsername(currentEmployee.username);
      setFirstName(currentEmployee.firstName);
      setLastName(currentEmployee.lastName);
      setAge(currentEmployee.age);
      setGender(
        currentEmployee.gender
          ? currentEmployee.gender.charAt(0).toUpperCase() +
              currentEmployee.gender.slice(1).toLowerCase()
          : ""
      );
      setEmail(currentEmployee.email);
      setPhone(currentEmployee.phone ?? "");
      setAddress(currentEmployee.address.address);
      setCity(currentEmployee.address.city);
      setState(currentEmployee.address.state);
      setCountry(currentEmployee.address.country);
      setDepartment(currentEmployee.company.department);
      setRole(currentEmployee.company.title);

      setLoading(false);
    }

    loadEmployee();
  }, [params, allEmployees, employeesLoading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!employee) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      /*
       * =================================================
       * NEWLY ADDED EMPLOYEE
       * =================================================
       *
       * DummyJSON does not permanently store employees
       * created through /users/add.
       *
       * Therefore, don't send a PUT request for local
       * employees. Update our application state directly.
       */
      if (employee.isLocal) {
        const updatedEmployee: Employee = {
          ...employee,
          username,
          firstName,
          lastName,
          email,
          phone,
          age: Number(age),
          gender: gender.toLowerCase(),
          address: {
            ...employee.address,
            address,
            city,
            state,
            country,
          },

          company: {
            ...employee.company,
            department,
            title: role,
          },
        };

        /*
         * Update master dataset.
         */
        setAllEmployees((currentEmployees) =>
          currentEmployees.map((currentEmployee) =>
            currentEmployee.id === employee.id
              ? updatedEmployee
              : currentEmployee
          )
        );

        /*
         * Update current page state.
         */
        setEmployees((currentEmployees) =>
          currentEmployees.map((currentEmployee) =>
            currentEmployee.id === employee.id
              ? updatedEmployee
              : currentEmployee
          )
        );

        /*
         * Update local page state.
         */
        setEmployee(updatedEmployee);

        setMessage("Employee updated successfully.");

        return;
      }

      /*
       * =================================================
       * EXISTING DUMMYJSON EMPLOYEE
       * =================================================
       *
       * Existing employees continue to use the API
       * exactly as before.
       */
      const response = await fetch(
        `https://dummyjson.com/users/${employee.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,
            firstName,
            lastName,
            email,
            phone,
            age: Number(age),
            gender: gender.toLowerCase(),
            address: {
              ...employee.address,
              address,
              city,
              state,
              country,
            },

            company: {
              department,
              title: role,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update employee");
      }

      const data = await response.json();

      /*
       * Keep existing status because status is an
       * application-level property.
       */
      const updatedEmployee: Employee = {
        ...employee,

        ...data,

        status: employee.status,

        company: {
          ...employee.company,
          ...data.company,
        },
      };

      /*
       * Update master dataset.
       */
      setAllEmployees((currentEmployees) =>
        currentEmployees.map((currentEmployee) =>
          currentEmployee.id === employee.id ? updatedEmployee : currentEmployee
        )
      );

      /*
       * Update current page employees.
       */
      setEmployees((currentEmployees) =>
        currentEmployees.map((currentEmployee) =>
          currentEmployee.id === employee.id ? updatedEmployee : currentEmployee
        )
      );

      /*
       * Update local employee state.
       */
      setEmployee(updatedEmployee);

      setMessage("Employee updated successfully.");
    } catch (error) {
      console.error(error);

      setMessage("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || employeesLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-500">Loading employee...</p>
      </main>
    );
  }

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
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/employees"
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Back to Employees
          </Link>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Edit Employee
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update employee information.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {/* User Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                User Name
              </label>

              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter User name"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* First Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                First Name
              </label>

              <input
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Last Name
              </label>

              <input
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

              {/* Phone */}
              <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

              {/* Age */}
              <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Age
              </label>

              <input
                type="number"
                value={age}
                onChange={(event) => setAge(Number(event.target.value))}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

             {/* Gender */}
             <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
               Select
              </label>

              <select required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200" value={gender} onChange={(event) => setGender(event.target.value)}>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

              {/* address */}
              <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Address
              </label>

              <input
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                 required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

             {/* City */}
             <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                City
              </label>

              <input
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

             {/* address - state*/}
             <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                State
              </label>

              <input
                type="text"
                value={state}
                onChange={(event) => setState(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

             {/* address - country*/}
             <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Country
              </label>

              <input
                type="text"
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Department */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Department
              </label>

              <select
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Select department</option>

                {departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Role
              </label>

              <input
                type="text"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="mt-5 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
              {message}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-6">
            <Link
              href="/employees"
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
