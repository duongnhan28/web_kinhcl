import clsx from 'clsx';
import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', ...props }, ref) => {
        const base =
            'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';
        const variants: Record<ButtonVariant, string> = {
            primary: 'bg-slate-950 text-white hover:bg-slate-800',
            secondary: 'border border-slate-200 bg-white text-slate-950 hover:border-slate-300',
            ghost: 'bg-transparent text-slate-950 hover:bg-slate-100'
        };
        return <button ref={ref} className={clsx(base, variants[variant], className)} {...props} />;
    }
);

Button.displayName = 'Button';
