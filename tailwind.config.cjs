/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
const safeListFile = 'safelist.txt'

// colors.indigo
const SAFELIST_COLORS = 'colors'

module.exports = {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './safelist.txt'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: [
        'Inter',
        'Roboto',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      serif: [
        'ui-serif',
        'Georgia',
        'Cambria',
        '"Times New Roman"',
        'Times',
        'serif',
      ],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
    },
    screens: {
      '821px': '821px',
      xs: '576px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1800px',
      '4xl': '2200px',
    },
    extend: {
      colors: {
        'color-1': '#000000',
        supreme: '#f59701',
        pro: '#021d6d',
        'alive-pack': '#00b000',
        'freedom-pack': '#c00005',
        'business-pack': '#6822a3',
        'vip-pack': '#bd9c3a',
        'elite-pack': '#959595',
      },
      backgroundColor: {
        'custom-rgba': 'rgba(7, 10, 41, 0.3)',
        'custom-gradient-color':
          'linear-gradient(to right, #A243FF 0%, #7673FF 30%, #13DEFE 100%)',
      },
      backgroundImage: {
        gradient:
          'linear-gradient(90deg, rgba(162,67,255,1) 0%, rgba(118,115,255,1) 35%, rgba(19,222,254,1) 100%)',
        'custom-close': 'linear-gradient(to right, #ff2020, #ac2038)',
        'custom-order': 'linear-gradient(to left, #4272C7, #70a1f5)',
        'custom-pay': 'linear-gradient(to right, #6bc258, #13605b)',
        'custom-gradient':
          'linear-gradient(to right, #A243FF 0%, #7673FF 30%, #13DEFE 100%)',
        'gradient-academy':
          'linear-gradient(to bottom, #A243FF60 0%, #ffffff 45%)',
        'gradient-academy-purple': 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 40%, rgba(146, 104, 187, 1) 100%)',
        'gradient-academy-white': 'linear-gradient(to bottom, rgba(255, 255, 255, .4) 40%, rgba(255, 255, 255, 1) 100%)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.500'),
            maxWidth: '65ch',
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.400'),
          },
        },
      }),
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('./twSafelistGenerator')({
      path: safeListFile,
      patterns: [
        `text-{${SAFELIST_COLORS}}`,
        `bg-{${SAFELIST_COLORS}}`,
        `dark:bg-{${SAFELIST_COLORS}}`,
        `dark:hover:bg-{${SAFELIST_COLORS}}`,
        `dark:active:bg-{${SAFELIST_COLORS}}`,
        `hover:text-{${SAFELIST_COLORS}}`,
        `hover:bg-{${SAFELIST_COLORS}}`,
        `active:bg-{${SAFELIST_COLORS}}`,
        `ring-{${SAFELIST_COLORS}}`,
        `hover:ring-{${SAFELIST_COLORS}}`,
        `focus:ring-{${SAFELIST_COLORS}}`,
        `focus-within:ring-{${SAFELIST_COLORS}}`,
        `border-{${SAFELIST_COLORS}}`,
        `focus:border-{${SAFELIST_COLORS}}`,
        `focus-within:border-{${SAFELIST_COLORS}}`,
        `dark:text-{${SAFELIST_COLORS}}`,
        `dark:hover:text-{${SAFELIST_COLORS}}`,
        `h-{height}`,
        `w-{width}`,
      ],
    }),
    require('@tailwindcss/typography'),
  ],
}
