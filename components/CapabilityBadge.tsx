interface Props {
  label: string;
}

export function CapabilityBadge({ label }: Readonly<Props>) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-800/30 border border-violet-700/40 text-violet-300">
      {label}
    </span>
  );
}
