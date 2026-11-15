import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fef9ec',
          100: '#fdf0cb',
          200: '#fbdf8d',
          300: '#f9c94e',
          400: '#f7b324',
          500: '#f09410',
          600: '#d4710a',
          700: '#b0530c',
          800: '#8f4110',
          900: '#763611',
          950: '#431b04',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
