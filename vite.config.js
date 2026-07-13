import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	define: {
		'process.env': process.env
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@pages": path.resolve(__dirname, "./src/pages"),
			"@assets": path.resolve(__dirname, "./src/assets"),
			"@constants": path.resolve(__dirname, "./src/constants"),
			"@utils": path.resolve(__dirname, "./src/utils"),
			"@services": path.resolve(__dirname, "./src/services"),
		},
	},
	plugins: [react(), tailwindcss()],
	base: "/",
	assetsInclude: ["**/*.glb", "**/*.jpeg", "**/*.jpg", "**/*.JPEG", "**/*.JPG"],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					'vendor-react': ['react', 'react-dom', 'react-router'],
					'vendor-three': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/rapier'],
					'vendor-gsap': ['gsap', '@gsap/react'],
					'vendor-utils': ['axios', 'dayjs', 'lenis']
				}
			}
		}
	}
});
