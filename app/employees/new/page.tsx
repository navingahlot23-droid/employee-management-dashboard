"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useEmployees } from "@/context/EmployeeContext";

export default function NewEmployeePage() {
  const { setAllEmployees } = useEmployees();

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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://dummyjson.com/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          firstName,
          lastName,
          age:Number(age),
          gender,
          email,
          phone,
          address:{
            address,city,state,country
          },
          company: {
            department,
            title: role,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create employee");
      }

      const data = await response.json();

      console.log("Created employee:", data);

      /*
       * DummyJSON does not provide our application-level
       * status property, so we add it here.
       *
       * DummyJSON may also return an empty image value
       * for newly created employees.
       */
      const newEmployee = {
        ...data,
        image: data.image || "https://dummyjson.com/icon/default/128",
        status: "Active" as const,
        isLocal: true,
      };

      /*
       * IMPORTANT:
       * allEmployees is the master employee dataset.
       *
       * EmployeeTable, pagination and dashboard statistics
       * are all derived from allEmployees.
       */
      setAllEmployees((currentEmployees) => [...currentEmployees, newEmployee]);

      setMessage("Employee added successfully!");
      setUsername("");
      setFirstName("");
      setLastName("");
      setAge(0);
      setGender("");
      setEmail("");
      setPhone("");
      setAddress("");
      setCity("");
      setState("");
      setCountry("");
      setDepartment("");
      setRole("");
    } catch (error) {
      console.error(error);

      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
            Add Employee
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Add a new employee to the company.
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
                placeholder="Enter first name"
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
                placeholder="Enter last name"
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
                placeholder="employee@company.com"
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
                type="number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="90xxxxxxx"
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
                placeholder="30"
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
                placeholder="Enter Address"
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
                placeholder="Enter City"
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
                placeholder="Enter State"
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
                placeholder="Enter Country"
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

                <option value="Engineering">Engineering</option>

                <option value="Design">Design</option>

                <option value="Marketing">Marketing</option>

                <option value="HR">HR</option>

                <option value="Finance">Finance</option>
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
                placeholder="e.g. Frontend Developer"
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
              disabled={loading}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
