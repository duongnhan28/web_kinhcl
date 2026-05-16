import { PropsWithChildren } from 'react';

export function Card({ children }: PropsWithChildren) {
    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            {children}
        </div>
    );
}
