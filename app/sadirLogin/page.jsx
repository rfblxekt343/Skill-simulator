import Link from "next/link";

export default function Sadir() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
        בחר מיומנות
      </h1>
      <div className="buttons-container flex flex-wrap gap-6">
        <Link href="/handling-pressure">
          <button className="bg-amber-200 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
            התמודדות תחת לחץ
          </button>
        </Link>
        <Link href="/interceptor-management">
          <button className="bg-amber-300 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
            ניהול מלאי מיירטים
          </button>
        </Link>
        <Link href="/time-management">
          <button className="bg-amber-400 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
            ניהול זמן
          </button>
        </Link>
        <Link href="/drag">
          <button className="bg-amber-500 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
            סידור חלוניות
          </button>
        </Link>
      </div>
    </div>
  );
}
