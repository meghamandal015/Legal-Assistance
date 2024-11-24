export default function Loading() {
    return (
      <div className="flex h-screen w-screen flex-col justify-center items-center bg-gray-100 p-6 space-y-6">
        <div className="h-8 w-3/4 max-w-lg bg-gray-300 rounded-md animate-pulse"></div>

        <div className="h-6 w-2/4 max-w-md bg-gray-300 rounded-md animate-pulse"></div>

        <div className="h-48 w-full max-w-xl bg-gray-300 rounded-lg animate-pulse"></div>

        <div className="w-full max-w-xl space-y-3">
          <div className="h-4 w-full bg-gray-300 rounded-md animate-pulse"></div>
          <div className="h-4 w-5/6 bg-gray-300 rounded-md animate-pulse"></div>
          <div className="h-4 w-4/6 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }
  