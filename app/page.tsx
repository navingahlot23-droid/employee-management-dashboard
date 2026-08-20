"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const handleLogout = () => {
    logout();
    router.replace("/login");
  };
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-100">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="hidden w-64 bg-gray-900 text-white md:block">
            <div className="border-b border-gray-800 px-6 py-5">
              <h1 className="text-xl font-bold">EmployeeHub</h1>

              <p className="mt-1 text-xs text-gray-400">Employee Management</p>
            </div>

            <nav className="px-4 py-6">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Main Menu
              </p>

              <a
                href="#"
                className="block rounded-lg bg-gray-800 px-3 py-2.5 text-sm font-medium"
              >
                Dashboard
              </a>

              <a
                href="#"
                className="mt-1 block rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                Employees
              </a>

              <a
                href="#"
                className="mt-1 block rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                Departments
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Top Bar */}
            <header className="border-b border-gray-200 bg-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Dashboard
                  </h2>

                  <p className="text-sm text-gray-500">
                    Welcome back! Here's what's happening today.
                  </p>
                </div>

               
              </div>
            </header>

            {/* Dashboard */}
            <section className="flex-1 p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Card 1 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-500">Total Employees</p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">124</p>

                  <p className="mt-2 text-xs text-green-600">
                    +8% from last month
                  </p>
                </div>

                {/* Card 2 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-500">Active Employees</p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">118</p>

                  <p className="mt-2 text-xs text-green-600">95% active</p>
                </div>

                {/* Card 3 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-500">Departments</p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">8</p>

                  <p className="mt-2 text-xs text-gray-500">
                    Across the company
                  </p>
                </div>

                {/* Card 4 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-500">New This Month</p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">12</p>

                  <p className="mt-2 text-xs text-blue-600">New employees</p>
                </div>
              </div>

              {/* Employee Overview */}
              <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Employee Overview
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Recently added employees
                    </p>
                  </div>

                  <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                    View Employees
                  </button>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-6">
                  <p className="text-sm text-gray-500">
                    Employee data will appear here.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
