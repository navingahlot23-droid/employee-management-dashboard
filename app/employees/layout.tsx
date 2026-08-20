import { ReactNode } from "react";
import { EmployeeProvider } from "@/context/EmployeeContext";

export default function EmployeesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <EmployeeProvider>
      {children}
    </EmployeeProvider>
  );
}