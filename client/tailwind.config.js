/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: '#ECF4D6',
				secondary: '#9AD0C2',
				third: '#2D9596',
				forth: '#265073',
				white: '#ffffff',
			},
		},
		screens: {
			sm: '640px',
			// => @media (min-width: 640px) { ... }

			smx: '500px',
			// => @media (min-width: 640px) { ... }

			md: '710px',
			// => @media (min-width: 768px) { ... }

			smd: '830px',

			lg: '985px',
			// => @media (min-width: 1024px) { ... }

			xl: '1150px',
			// => @media (min-width: 1280px) { ... }

			'2xl': '1500px',
			// => @media (min-width: 1536px) { ... }

			'3xl': '1800px',

			'4xl': '2100px',
		},
	},
	plugins: [],
};
