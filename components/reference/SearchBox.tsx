"use client";

export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-border bg-bg-raised px-4 py-2.5 text-sm outline-none placeholder:text-fg-faint focus:border-accent"
    />
  );
}

export function FilterPills<T extends string>({
  options,
  active,
  onChange,
  allLabel = "All",
}: {
  options: T[];
  active: T | null;
  onChange: (v: T | null) => void;
  allLabel?: string;
}) {
  const base =
    "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors";
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        className={`${base} ${
          active === null
            ? "border-accent bg-accent-soft text-accent"
            : "border-border text-fg-muted hover:text-fg"
        }`}
        onClick={() => onChange(null)}
      >
        {allLabel}
      </button>
      {options.map((o) => (
        <button
          key={o}
          className={`${base} ${
            active === o
              ? "border-accent bg-accent-soft text-accent"
              : "border-border text-fg-muted hover:text-fg"
          }`}
          onClick={() => onChange(active === o ? null : o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
