"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function EmployeeHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:block text-right">
        <p className="text-sm font-semibold text-gray-900">
          {user?.name}
        </p>

        <p className="text-xs text-gray-500">
          {user?.email}
        </p>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
        {user?.name?.charAt(0).toUpperCase()}
      </div>

      <button
        onClick={handleLogout}
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}