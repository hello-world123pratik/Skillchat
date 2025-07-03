import { Link } from "react-router-dom";
import {
  Users,
  MessageSquare,
  CalendarClock,
  Rocket,
  LogIn,
  ShieldCheck,
  Brain,
  BadgeCheck,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen font-sans bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="py-32 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            <span className="text-white">Powering Team Collaboration</span>{" "}
            <span className="text-indigo-500">with SkillSync</span>
          </h1>
          <p className="text-xl sm:text-2xl text-neutral-400 font-light mb-10 max-w-2xl mx-auto">
            A streamlined platform to manage groups, collaborate in real-time, and keep your team aligned.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 text-lg font-semibold rounded-full transition inline-flex items-center gap-2"
            >
              <Rocket size={20} />
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-indigo-500 text-indigo-300 hover:bg-indigo-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-full transition inline-flex items-center gap-2"
            >
              <LogIn size={20} />
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-14 text-white">
            Built for High-Performance Teams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 hover:border-indigo-600 transition shadow-md hover:shadow-indigo-500/10">
              <Users size={36} className="text-indigo-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Smart Group Management</h3>
              <p className="text-neutral-400">
                Create and organize team spaces with advanced permission control.
              </p>
            </div>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 hover:border-indigo-600 transition shadow-md hover:shadow-indigo-500/10">
              <MessageSquare size={36} className="text-indigo-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Real-time Messaging</h3>
              <p className="text-neutral-400">
                Communicate instantly with secure, low-latency chat across teams.
              </p>
            </div>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 hover:border-indigo-600 transition shadow-md hover:shadow-indigo-500/10">
              <CalendarClock size={36} className="text-indigo-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Integrated Scheduling</h3>
              <p className="text-neutral-400">
                Manage calendars, deadlines, and team reminders effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By / Logos Section */}
      <section className="py-20 bg-gray-800 text-center">
        <h3 className="text-2xl text-gray-300 font-semibold mb-8">Trusted by modern teams</h3>
        <div className="flex flex-wrap justify-center gap-10 text-indigo-400">
          <ShieldCheck size={36} />
          <Brain size={36} />
          <BadgeCheck size={36} />
          <Rocket size={36} />
          <Users size={36} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-600 py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto text-white">
          <h2 className="text-4xl font-bold mb-4">
            Start Your Journey with SkillSync
          </h2>
          <p className="text-lg mb-8">
            Join top-performing teams transforming their workflows.
          </p>
          <Link
            to="/register"
            className="bg-white text-indigo-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-100 transition"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-center py-6 text-neutral-500 text-sm border-t border-gray-800">
        &copy; {new Date().getFullYear()} SkillSync. All rights reserved.
      </footer>
    </main>
  );
}
