"use client";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">

        <h2 className="text-xl font-semibold text-gray-900">
          Something went wrong
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          We couldn't load the employee information.
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Try Again
        </button>

      </div>
    </main>
  );
}