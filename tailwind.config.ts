import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
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
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				// Paleta cyberpunk brasileira otimizada para contraste
				cyber: {
					yellow: '#FFD700',
					'yellow-bright': '#FFEB3B',
					'yellow-dark': '#F57F17',
					green: '#00E676',
					'green-bright': '#1DE9B6',
					'green-dark': '#00C853',
					blue: '#2196F3',
					'blue-bright': '#03DAC6',
					'blue-dark': '#0277BD',
					purple: '#9C27B0',
					'purple-bright': '#E1BEE7',
					'purple-dark': '#6A1B9A',
					pink: '#E91E63',
					'pink-bright': '#F8BBD9',
					'pink-dark': '#AD1457',
					// Tons neutros com melhor contraste
					gray: {
						50: '#FAFAFA',
						100: '#F5F5F5',
						200: '#EEEEEE',
						300: '#E0E0E0',
						400: '#BDBDBD',
						500: '#9E9E9E',
						600: '#757575',
						700: '#616161',
						800: '#424242',
						900: '#212121',
					}
				},
				// Cores originais mantidas para compatibilidade
				terra: {
					50: '#fef9f0',
					100: '#fef1dc',
					200: '#fce0b8',
					300: '#f9c685',
					400: '#f5a450',
					500: '#f28b2b',
					600: '#e3721c',
					700: '#bc5b19',
					800: '#964a1c',
					900: '#793f1a',
				},
				spice: {
					50: '#fef7ed',
					100: '#fdecd5',
					200: '#fbd5aa',
					300: '#f7b574',
					400: '#f2893c',
					500: '#ef6820',
					600: '#e04f16',
					700: '#ba3c14',
					800: '#943018',
					900: '#772916',
				},
				leaf: {
					50: '#f0fdf4',
					100: '#dcfce7',
					200: '#bbf7d0',
					300: '#86efac',
					400: '#4ade80',
					500: '#22c55e',
					600: '#16a34a',
					700: '#15803d',
					800: '#166534',
					900: '#14532d',
				},
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
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
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
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'bounce-gentle': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-5px)'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)'
					},
					'50%': {
						boxShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(0, 255, 136, 0.4)'
					}
				},
				'neon-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(0, 128, 255, 0.6), inset 0 0 10px rgba(138, 43, 226, 0.3)'
					},
					'50%': {
						boxShadow: '0 0 20px rgba(255, 215, 0, 1), 0 0 40px rgba(0, 255, 136, 0.8), inset 0 0 20px rgba(138, 43, 226, 0.5)'
					}
				},
				'cyber-glow': {
					'0%': {
						textShadow: '0 0 5px #FFD700, 0 0 10px #FFD700, 0 0 15px #0080FF'
					},
					'50%': {
						textShadow: '0 0 10px #FFD700, 0 0 20px #00FF88, 0 0 30px #8A2BE2'
					},
					'100%': {
						textShadow: '0 0 5px #FFD700, 0 0 10px #FFD700, 0 0 15px #0080FF'
					}
				},
				'grid-move': {
					'0%': {
						transform: 'translateX(0) translateY(0)'
					},
					'100%': {
						transform: 'translateX(-50px) translateY(-50px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
				'cyber-glow': 'cyber-glow 3s ease-in-out infinite',
				'grid-move': 'grid-move 20s linear infinite',
			},
			fontFamily: {
				// Fontes modernas e legíveis otimizadas
				'display': ['Inter', 'system-ui', 'sans-serif'],
				'heading': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
				'body': ['Inter', 'system-ui', 'sans-serif'],
				'cyber': ['JetBrains Mono', 'Fira Code', 'monospace'],
				'sans': ['Inter', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
				'7xl': ['4.5rem', { lineHeight: '1' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }],
			},
			backgroundImage: {
				'cyber-grid': `
					linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
					linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px),
					linear-gradient(rgba(0, 128, 255, 0.05) 1px, transparent 1px),
					linear-gradient(90deg, rgba(0, 128, 255, 0.05) 1px, transparent 1px)
				`,
				'cyber-gradient': 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(0, 255, 136, 0.1) 50%, rgba(138, 43, 226, 0.1) 100%)',
			},
			backgroundSize: {
				'cyber-grid': '100px 100px, 100px 100px, 20px 20px, 20px 20px',
			}
		}
	},
	plugins: [animate],
} satisfies Config;
