import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-lg font-bold text-white">
            C
          </div>
          <span className="text-xl font-bold text-gray-800">ChikkaChat</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="mx-auto max-w-5xl px-6 pt-16 text-center md:pt-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
          Real-time messaging,
          <br />
          <span className="text-blue-500">made simple.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
          ChikkaChat is a fast, secure messaging platform. Send messages
          instantly, share files, create group chats, and see when your friends
          are online — all in real time.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/register"
            className="rounded-lg bg-blue-500 px-8 py-3 text-base font-medium text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600"
          >
            Start Chatting
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            Sign In
          </Link>
        </div>

        {/* Features */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Instant Messaging</h3>
            <p className="mt-2 text-sm text-gray-500">
              Messages delivered in under 500ms with Socket.IO real-time technology.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Secure by Default</h3>
            <p className="mt-2 text-sm text-gray-500">
              Firebase Authentication ensures your conversations stay private and protected.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Group Chats</h3>
            <p className="mt-2 text-sm text-gray-500">
              Create groups, add members, and collaborate with everyone in one place.
            </p>
          </div>
        </div>

        {/* Secondary features */}
        <div className="mt-12 grid gap-6 pb-24 md:grid-cols-4">
          {[
            { label: "Typing Indicators", icon: "..." },
            { label: "Online Presence", icon: "●" },
            { label: "File Sharing", icon: "📎" },
            { label: "Message Search", icon: "🔍" },
          ].map((f) => (
            <div key={f.label} className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6 text-center text-sm text-gray-400">
        ChikkaChat &copy; {new Date().getFullYear()} — Built by Vic Andrew A. Dizon
      </footer>
    </div>
  );
}
