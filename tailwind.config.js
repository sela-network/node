/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./components/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
	darkMode: 'class',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				'border': 'hsl(var(--border))',
				'input': 'hsl(var(--input))',
				'ring': 'hsl(var(--ring))',
				'background': 'var(--background)',
				'foreground': 'hsl(var(--foreground))',
				'dark': 'var(--dark)',
				'skeleton': 'var(--skeleton)',
				'plain': 'var(--plain)',
				'plain-foreground': 'var(--plain-foreground)',
				'plain-foreground-80': 'var(--plain-foreground-80)',
				'hint': 'var(--hint)',
				'button': 'var(--button)',
				'button-alt': 'var(--button-alt)',
				'divider': 'var(--divider)',
				'link': 'var(--link)',
				'hint-secondary': 'var(--hint-secondary)',
				'green': 'var(--green)',
				'cyan': 'var(--cyan)',
				'primary': {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				'secondary': {
					DEFAULT: 'var(--secondary)',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				'destructive': {
					DEFAULT: 'var(--destructive)',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				'destructive-alt': {
					DEFAULT: 'var(--destructive-alt)',
				},
				'muted': {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				'accent': {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				'popover': {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				'card': {
					DEFAULT: 'var(--card)',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			fontSize: {
				'xs-l': '0.75rem',
				'sm-s': '0.813rem',
				'base-sm': '0.938rem',
				'base-lg': '1.063rem',
				'3.5xl': '2.125rem',
			},
			borderRadius: {
				xlg: '0.6rem',
				'md-sm': '5px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
