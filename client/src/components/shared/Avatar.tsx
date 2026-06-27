interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  ring?: boolean;
}

const sizeClasses = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl",
};

const indicatorClasses = {
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
  lg: "h-3.5 w-3.5",
  xl: "h-4 w-4",
};

// Deterministic gradient per name so avatars feel distinct yet on-brand.
const gradients = [
  "from-indigo-500 to-violet-500",
  "from-sky-500 to-indigo-500",
  "from-violet-500 to-fuchsia-500",
  "from-blue-500 to-cyan-500",
  "from-fuchsia-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-red-500",
];

function gradientFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export default function Avatar({
  src,
  name,
  size = "md",
  online,
  ring,
}: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative inline-flex shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover ${
            ring ? "ring-2 ring-white shadow-soft" : ""
          }`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-gradient-to-br ${gradientFor(
            name
          )} font-semibold text-white ${
            ring ? "ring-2 ring-white shadow-soft" : ""
          }`}
        >
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 block ${indicatorClasses[size]} rounded-full border-2 border-white ${
            online ? "bg-emerald-500" : "bg-slate-300"
          }`}
        >
          {online && (
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
          )}
        </span>
      )}
    </div>
  );
}
