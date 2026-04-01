import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      transitionTimingFunction: {
        tactile: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        slow: "700ms",
        slower: "1200ms",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: {
        landsvig: {
          css: {
            "--tw-prose-body": "hsl(210 4% 18% / 0.7)",
            "--tw-prose-headings": "hsl(210 4% 18%)",
            "--tw-prose-links": "hsl(210 4% 18%)",
            "--tw-prose-bold": "hsl(210 4% 18%)",
            "--tw-prose-counters": "hsl(210 4% 18% / 0.4)",
            "--tw-prose-bullets": "hsl(210 4% 18% / 0.3)",
            "--tw-prose-hr": "hsl(36 16% 87%)",
            "--tw-prose-quotes": "hsl(210 4% 18% / 0.7)",
            "--tw-prose-quote-borders": "hsl(36 16% 87%)",
            "--tw-prose-code": "hsl(210 4% 18%)",
            "--tw-prose-pre-code": "hsl(210 4% 18%)",
            "--tw-prose-pre-bg": "hsl(36 16% 87% / 0.5)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "13px",
            lineHeight: "1.8",
            maxWidth: "68ch",
            "h1, h2, h3, h4": {
              fontFamily: "'Playfair Display', serif",
              fontWeight: "400",
              letterSpacing: "-0.02em",
              lineHeight: "1.2",
            },
            a: {
              textDecoration: "none",
              borderBottom: "1px solid hsl(36 16% 87%)",
              transition: "border-color 0.7s",
              "&:hover": {
                borderColor: "hsl(210 4% 18% / 0.6)",
              },
            },
            blockquote: {
              fontStyle: "normal",
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1em",
              borderLeftColor: "hsl(36 16% 87%)",
            },
            code: {
              fontFamily: "'JetBrains Mono', monospace",
              background: "hsl(36 16% 87% / 0.5)",
              padding: "0.15em 0.4em",
              borderRadius: "0.125rem",
              fontWeight: "400",
              fontSize: "0.9em",
            },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
            pre: {
              background: "hsl(36 16% 87% / 0.4)",
              borderRadius: "0.125rem",
              border: "1px solid hsl(36 16% 87%)",
            },
          },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
} satisfies Config;
