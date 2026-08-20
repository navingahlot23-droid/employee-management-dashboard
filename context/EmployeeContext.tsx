"use client";

import { Employee } from "@/types/employee";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type EmployeeContextType = {
  employees: Employee[];
  allEmployees: Employee[];

  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;

  setAllEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;

  loading: boolean;
  error: string;

  departments: string[];

  currentPage: number;
  totalEmployees: number;
  pageSize: number;

  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;

  activeEmployees: number;
  departmentCount: number;
};

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const totalEmployees = allEmployees.length;

  /*
   * Departments are derived from the complete
   * employee dataset.
   */
  const departments = useMemo(() => {
    return Array.from(
      new Set(allEmployees.map((employee) => employee.company.department))
    );
  }, [allEmployees]);

  /*
   * Active employee count is derived from
   * the complete employee dataset.
   */
  const activeEmployees = useMemo(() => {
    return allEmployees.filter((employee) => employee.status === "Active")
      .length;
  }, [allEmployees]);

  /*
   * Department count is derived from
   * the complete employee dataset.
   */
  const departmentCount = useMemo(() => {
    return new Set(allEmployees.map((employee) => employee.company.department))
      .size;
  }, [allEmployees]);

  /*
   * Load the complete employee dataset.
   *
   * This runs only once.
   */
  useEffect(() => {
    async function loadAllEmployees() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("https://dummyjson.com/users?limit=0");

        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }

        const data = await response.json();

        const employeesWithStatus: Employee[] = data.users.map(
          (employee: Omit<Employee, "status">, index: number) => ({
            ...employee,
            status: index % 2 === 0 ? "Active" : "Inactive",
          })
        );

        setAllEmployees(employeesWithStatus);

       
      } catch (error) {
        console.error(error);

        setError("Unable to load employees.");
      } finally {
        setLoading(false);
      }
    }

    loadAllEmployees();
  }, []);

  /*
   * Create the current page from the
   * complete employee dataset.
   *
   * No second API request is necessary.
   */
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;

    const currentPageEmployees = allEmployees.slice(
      startIndex,
      startIndex + pageSize
    );

    setEmployees(currentPageEmployees);
  }, [allEmployees, currentPage]);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        allEmployees,

        setEmployees,
        setAllEmployees,

        loading,
        error,

        departments,

        currentPage,
        totalEmployees,
        pageSize,

        setCurrentPage,

        activeEmployees,
        departmentCount,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const context = useContext(EmployeeContext);

  if (!context) {
    throw new Error("useEmployees must be used inside EmployeeProvider");
  }

  return context;
}
