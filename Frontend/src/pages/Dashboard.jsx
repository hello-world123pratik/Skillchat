import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Welcome to <span className="text-indigo-600">SkillSync</span>
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            A collaborative space to organize, communicate, and build together.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            to="/groups"
            className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <h2 className="text-2xl font-semibold text-indigo-600">Groups</h2>
            <p className="text-gray-700 mt-2 text-base">
              Manage your groups, coordinate activities, and access shared calendars.
            </p>
          </Link>

          <Link
            to="/start-chat"
            className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <h2 className="text-2xl font-semibold text-indigo-600">Start Chat</h2>
            <p className="text-gray-700 mt-2 text-base">
              Connect instantly with team members or peers by starting a direct chat.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}
