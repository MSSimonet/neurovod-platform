/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: "#FAFAFA",
        card: "#FFFFFF",
        subtle: "#F1F5F9",
        alt: "#E2E8F0",
        ink: {
          DEFAULT: "#0F172A",
          secondary: "#334155",
          muted: "#64748B",
          inverse: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#0369A1",
          hover: "#075985",
          surface: "#F0F9FF",
          border: "#BAE6FD",
        },
        ok: {
          DEFAULT: "#047857",
          surface: "#ECFDF5",
        },
        rule: {
          DEFAULT: "#E2E8F0",
          strong: "#CBD5E1",
        },
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        none: '0',
        xs: '2px',
        sm: '4px',
        DEFAULT: '4px',
        md: '6px',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        raised: '0 2px 6px -1px rgba(15, 23, 42, 0.08)',
        overlay: '0 8px 24px -8px rgba(15, 23, 42, 0.18)',
        none: 'none',
      },
      maxWidth: {
        shell: '1240px',
        prose: '68ch',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      animation: {
        'rise': 'rise 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'veil': 'veil 0.16s ease-out',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        veil: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
