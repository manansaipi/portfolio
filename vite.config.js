import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
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
});
