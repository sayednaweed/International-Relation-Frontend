/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	fontFamily: {
  		segoe: [
  			'Segoe UI'
  		]
  	},
  	fontSize: {
  		'sm-ltr': '11px',
  		'md-ltr': '12px',
  		'lg-ltr': '13px',
  		'xl-ltr': '14px',
  		'2xl-ltr': '15px',
  		'3xl-ltr': '17px',
  		'4xl-ltr': '20px',
  		'sm-rtl': '15px',
  		'md-rtl': '16px',
  		'lg-rtl': '17px',
  		'xl-rtl': '18px',
  		'2xl-rtl': '19px',
  		'3xl-rtl': '20px',
  		'4xl-rtl': '22px'
  	},
  	extend: {
  		screens: {
  			xxl: '500px'
  		},
  		colors: {
  			tertiary: 'var(--tertiary)',
  			fourth: 'var(--fourth)',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))',
  				secondary: 'hsl(var(--card-secondary))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			animLoading: {
  				'100%': {
  					transform: 'translate(-50%,-50%) rotate(720deg)'
  				}
  			},
  			shimmer: {
  				'0%': {
  					backgroundPosition: '-1200px 0'
  				},
  				'100%': {
  					backgroundPosition: '1200px 0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'loading-parent': 'animLoading 3s infinite alternate',
  			'loading-child': 'animLoading 5s infinite alternate',
  			shimmer: 'shimmer 2.2s forwards infinite linear'
  		},
  		boxShadow: {
  			tab: '3px 3px 0px 3px hsl(var(--secondary))',
  			tabReverse: '3px -3px 0px 3px hsl(var(--secondary))',
  			modelShadow: '0px 0px 8px -2px hsl(var(--primary))'
  		},
  		backgroundImage: '(theme) => ({\\r\\n        "gradient-shimmer":\\r\\n          "linear-gradient(to right, var(--from-shimmer) 10%, var(--to-shimmer) 18%, var(--from-shimmer) 25%)",\\r\\n      })'
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
