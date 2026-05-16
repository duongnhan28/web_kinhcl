import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
            },
            colors: {
                brand: {
                    950: '#0f172a',
                    900: '#111827',
                    700: '#334155'
                }
            },
            boxShadow: {
                soft: '0 20px 50px rgba(15, 23, 42, 0.08)'
            }
        }
    },
    plugins: []
};

export default config;
