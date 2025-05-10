// app/loading.tsx

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <div className="w-16 h-16 relative">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-pink-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-500">Loading...</p>
    </div>
  )
}
