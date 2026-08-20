"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useEmployees } from "@/context/EmployeeContext";

export default function EmployeeTable() {
  const {
    allEmployees,
    setAllEmployees,
    loading,
    error,
    departments,
    currentPage,
    pageSize,
    setCurrentPage,
  } = useEmployees();

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const departmentOptions = ["All", ...departments];

  /*
   * Reset pagination when filters change.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, department, setCurrentPage]);

  /*
   * Filter the complete employee dataset.
   */
  const filteredEmployees = useMemo(() => {
    return allEmployees.filter((employee) => {
      const fullName =
        `${employee.firstName} ${employee.lastName}`.toLowerCase();

      const searchTerm = search.toLowerCase();

      const searchMatch =
        fullName.includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm);

      const departmentMatch =
        department === "All" ||
        employee.company.department === department;

      return searchMatch && departmentMatch;
    });
  }, [allEmployees, search, department]);

  const filteredTotal = filteredEmployees.length;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTotal / pageSize)
  );

  /*
   * Employees displayed on current page.
   */
  const paginatedEmployees = useMemo(() => {
    const startIndex =
      (currentPage - 1) * pageSize;

    return filteredEmployees.slice(
      startIndex,
      startIndex + pageSize
    );
  }, [
    filteredEmployees,
    currentPage,
    pageSize,
  ]);

  /*
   * Pagination numbers.
   */
  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const startPage = Math.max(
      2,
      currentPage - 1
    );

    const endPage = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (
      let page = startPage;
      page <= endPage;
      page++
    ) {
      pages.push(page);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  /*
   * Delete employee.
   *
   * allEmployees is the master dataset, so we update
   * allEmployees rather than employees.
   *
   * DummyJSON is a mock API, so even if its DELETE
   * request fails, we remove the employee locally.
   */
  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(
        `https://dummyjson.com/users/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        console.warn(
          "DummyJSON delete request failed. Removing employee locally."
        );
      } else {
        await response.json();
      }

      /*
       * Update the master employee dataset.
       *
       * This automatically updates:
       * - Employee table
       * - Pagination
       * - Total employees
       * - Active employees
       * - Department statistics
       */
      setAllEmployees((currentEmployees) =>
        currentEmployees.filter(
          (employee) => employee.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete API failed. Removing employee locally:",
        error
      );

      /*
       * Keep UI state correct even if the mock API
       * request fails.
       */
      setAllEmployees((currentEmployees) =>
        currentEmployees.filter(
          (employee) => employee.id !== id
        )
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-gray-500">
          Loading employees...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">
        <p className="text-sm font-medium text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">

          {/* Search */}
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Search employees
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* Department */}
          <div className="w-full md:w-56">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Department
            </label>

            <select
              value={department}
              onChange={(event) =>
                setDepartment(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
            >
              {departmentOptions.map(
                (department) => (
                  <option
                    key={department}
                    value={department}
                  >
                    {department}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {paginatedEmployees.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">
              {filteredTotal}
            </span>{" "}
            employees
          </p>

          {(search || department !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDepartment("All");
              }}
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Employee
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Department
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Role
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map(
                  (employee) => (
                    <tr
                      key={employee.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >
                      {/* Employee */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              employee.image ||
                              "https://dummyjson.com/icon/default/128"
                            }
                            alt={`${employee.firstName} ${employee.lastName}`}
                            className="h-10 w-10 rounded-full object-cover"
                          />

                          <div>
                            <p className="font-medium text-gray-900">
                              {employee.firstName}{" "}
                              {employee.lastName}
                            </p>

                            <p className="text-sm text-gray-500">
                              {employee.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {employee.company.department}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {employee.company.title}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            employee.status ===
                            "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/employees/${employee.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            View
                          </Link>

                          <Link
                            href={`/employees/edit/${employee.id}`}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                employee.id
                              )
                            }
                            disabled={
                              deletingId ===
                              employee.id
                            }
                            className="text-sm font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId ===
                            employee.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      No employees found
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Try changing your search or
                      department filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-500">
            Page{" "}
            <span className="font-medium text-gray-900">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">
              {totalPages}
            </span>
          </p>

          <div className="flex items-center gap-1">

            {/* Previous */}
            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (page) => page - 1
                )
              }
              disabled={
                currentPage === 1 || loading
              }
              className="mr-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {pageNumbers.map(
              (page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-sm text-gray-500"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`min-w-10 rounded-lg px-3 py-2 text-sm font-medium ${
                      currentPage === page
                        ? "bg-gray-900 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
            )}

            {/* Next */}
            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (page) => page + 1
                )
              }
              disabled={
                currentPage === totalPages ||
                loading
              }
              className="ml-1 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}