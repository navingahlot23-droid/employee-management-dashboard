export default function Loading() {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-7xl">
  
          <div className="mb-6">
            <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200" />
  
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200" />
          </div>
  
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
  
            <div className="space-y-4 p-6">
  
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4"
                >
                  <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
  
                  <div className="flex-1">
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
  
                    <div className="mt-2 h-3 w-56 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
  
            </div>
          </div>
  
        </div>
      </main>
    );
  }