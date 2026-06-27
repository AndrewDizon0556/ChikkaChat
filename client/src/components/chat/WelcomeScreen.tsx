import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

interface WelcomeScreenProps {
  onOpenSidebar: () => void;
}

const quickActions = [
  {
    key: "chat",
    title: "Start a new chat",
    desc: "Message someone one-on-one",
    accent: "from-indigo-500 to-violet-500",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    ),
  },
  {
    key: "group",
    title: "Create a group",
    desc: "Bring everyone together",
    accent: "from-violet-500 to-fuchsia-500",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    ),
  },
  {
    key: "find",
    title: "Find friends",
    desc: "Search people by name or email",
    accent: "from-sky-500 to-indigo-500",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    ),
  },
];

const features = [
  {
    label: "Real-time messaging",
    desc: "Delivered instantly",
    color: "text-amber-500 bg-amber-50",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
  },
  {
    label: "Group conversations",
    desc: "Chat with your team",
    color: "text-violet-500 bg-violet-50",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    ),
  },
  {
    label: "File sharing",
    desc: "Send images & docs",
    color: "text-emerald-500 bg-emerald-50",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    ),
  },
  {
    label: "Presence indicators",
    desc: "See who's online",
    color: "text-sky-500 bg-sky-50",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
];

export default function WelcomeScreen({ onOpenSidebar }: WelcomeScreenProps) {
  const user = useAuthStore((s) => s.user);
  const { openSearchModal, openGroupModal } = useUIStore();

  const firstName = user?.display_name?.split(" ")[0];

  const handleAction = (key: string) => {
    if (key === "group") openGroupModal();
    else openSearchModal();
  };

  return (
    <div className="bg-dot-grid relative flex h-full flex-col items-center justify-center overflow-y-auto bg-brand-gradient-soft px-6 py-10">
      {/* Soft ambient glows */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl" />

      <div className="relative w-full max-w-xl animate-fade-in-up text-center">
        {/* Branded logo mark */}
        <div className="mx-auto mb-6 flex h-20 w-20 animate-float items-center justify-center rounded-3xl bg-brand-gradient shadow-float">
          <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 md:text-3xl">
          {firstName ? `Welcome back, ${firstName}` : "Welcome to ChikkaChat"}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 md:text-base">
          Select a conversation from the sidebar, or jump right in with one of
          the quick actions below.
        </p>

        {/* Quick actions */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {quickActions.map((a) => (
            <button
              key={a.key}
              onClick={() => handleAction(a.key)}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-white/60 bg-white/80 p-5 text-center shadow-card backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:shadow-float"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${a.accent} text-white shadow-soft transition-transform duration-200 group-hover:scale-110`}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {a.icon}
                </svg>
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-800">
                  {a.title}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {a.desc}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Mobile: open conversation list */}
        <div className="mt-6 flex justify-center md:hidden">
          <button onClick={onOpenSidebar} className="btn-primary">
            Open conversations
          </button>
        </div>

        {/* Feature highlights */}
        <div className="mt-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Everything you need
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 p-3 text-left shadow-soft backdrop-blur"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${f.color}`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {f.icon}
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-800">
                    {f.label}
                  </span>
                  <span className="block truncate text-xs text-slate-500">
                    {f.desc}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
