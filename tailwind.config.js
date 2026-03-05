/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modo Foco
        'foco-fundo': '#f47150',    
        'foco-detalhe': '#49671b',  
        
        // Modo Descanso
        'descanso-fundo': '#adc551', 
        'descanso-detalhe': '#DF2E38', 
      },
    },
  },
  plugins: [],
  
}