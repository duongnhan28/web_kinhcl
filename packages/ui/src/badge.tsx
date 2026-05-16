interface BadgeProps {
    label: string;
}

export function Badge({ label }: BadgeProps) {
    return (
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            {label}
        </span>
    );
}
