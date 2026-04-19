interface Props {
  label: string;
}

export function CapabilityBadge({ label }: Readonly<Props>) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted/30 border border-border/80/40 text-muted-foreground">
      {label}
    </span>
  );
}
