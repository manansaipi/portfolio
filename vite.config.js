import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	base: "/",
	assetsInclude: ["**/*.glb", "**/*.jpeg", "**/*.jpg", "**/*.JPEG", "**/*.JPG"],
	server: {
		host: true,
		port: 5173,
	},
});
