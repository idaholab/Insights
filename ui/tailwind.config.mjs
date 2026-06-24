import typography from '@tailwindcss/typography';

export default {
  purge: {
    content: ['./src/**/*.html', './src/**/*.js', './src/**/*.ts', './src/**/*.tsx'],
    options: {
      safelist: [
        'list-disc', 'list-decimal', 'border-neutralc-500', 'text-neutralc-100', 'text-error', 'text-success', 'text-orange-500', 'text-primary-500', 'text-xl', 'border-t', 'my-4', 'ml-8', 'mb-4', 'font-semibold'
      ],
    },
  },

  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(var(--color-primary-rgb-50))',
          100: 'rgb(var(--color-primary-rgb-100))',
          200: 'rgb(var(--color-primary-rgb-200))',
          300: 'rgb(var(--color-primary-rgb-300))',
          400: 'rgb(var(--color-primary-rgb-400))',
          500: 'rgb(var(--color-primary-rgb-500))',
          600: 'rgb(var(--color-primary-rgb-600))',
          700: 'rgb(var(--color-primary-rgb-700))',
          800: 'rgb(var(--color-primary-rgb-800))',
          900: 'rgb(var(--color-primary-rgb-900))',
          1000: 'rgb(var(--color-primary-rgb-1000))',
          DEFAULT: 'rgb(var(--color-primary-rgb-500))',
        },
        neutralc: {
          50: 'rgb(var(--color-neutral-rgb-50))',
          75: 'rgb(var(--color-neutral-rgb-75))',
          100: 'rgb(var(--color-neutral-rgb-100))',
          150: 'rgb(var(--color-neutral-rgb-150))',
          200: 'rgb(var(--color-neutral-rgb-200))',
          300: 'rgb(var(--color-neutral-rgb-300))',
          400: 'rgb(var(--color-neutral-rgb-400))',
          500: 'rgb(var(--color-neutral-rgb-500))',
          600: 'rgb(var(--color-neutral-rgb-600))',
          700: 'rgb(var(--color-neutral-rgb-700))',
          800: 'rgb(var(--color-neutral-rgb-800))',
          900: 'rgb(var(--color-neutral-rgb-900))',
          925: 'rgb(var(--color-neutral-rgb-925))',
          950: 'rgb(var(--color-neutral-rgb-950))',
          1000: 'rgb(var(--color-neutral-rgb-1000))',
          DEFAULT: 'rgb(var(--color-neutral-rgb-500))',
        },
        error: {
          light: 'rgb(var(--color-error-light-rgb))',
          dark: 'rgb(var(--color-error-dark-rgb))',
        },
        success: 'rgb(var(--color-success-rgb))',
        warning: {
          light: 'rgb(var(--color-warning-light-rgb))',
          dark: 'rgb(var(--color-warning-dark-rgb))',
          DEFAULT: 'rgb(var(--color-warning-dark-rgb))',
        },
      },
      boxShadow: {
        'md-gray-light': '0 3px 5px 0 rgba(25, 25, 25, 0.01), 0 1px 1px 0 rgba(25, 25, 25, 0.01), 0 2px 1px -1px rgba(25, 25, 25, 0.005)',
      },
      breakBefore: {
        'avoid-column': 'avoid-column',
      },
      fontFamily: {
        sans: ['source sans pro'],
        body: ['source sans pro'],
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [
    require('daisyui'),
    typography,
    // plugin(function ({ addComponents, theme }) {
    //   addComponents({
    //     '.btn-primary-inactive': {
    //       backgroundColor: theme('colors.primary-inactive'),
    //       color: theme('colors.white'),
    //       '&:hover': {
    //         backgroundColor: theme('colors.primary-inactive-hover'),
    //         filter: 'brightness(0.9)',
    //       },
    //     },
    //   });
    // }),
  ],
  daisyui: {
    styled: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: '',
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          "primary": '#2c7aba',
          "primary-focus": "",
          "primary-content": "#ffffff",
          'primary-inactive': '#1e4a85',
          neutralc: {
            50: '#f8fafc',
            75: '#f5f8fb',
            100: '#f1f5f9',
            150: '#dee5ed',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            925: '#080f21',
            950: '#020617',
            1000: '#00000b'
          },
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          "primary": '#2c7aba',
          "primary-focus": "",
          "primary-content": "#ffffff",
          'primary-inactive': '#1e4a85',
          neutralc: {
            50: '#f9fafb',
            75: '#f6f7f9',
            100: '#f3f4f6',
            150: '#ecedf0',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
            925: '#0A101C',
            950: '#030712',
            1000: '#000008'
          },
        },
      },
    ],

  },
  variants: {
    extend: {
      backgroundColor: ['hover', 'focus'],
    },
  },

};
