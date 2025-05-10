import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { Analytics } from "@vercel/analytics/react";

import Home from "./pages/Home/Home";
import About from "./pages/About/About.jsx";
import Experience from "./pages/Experience/Experience.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />}>
					<Route index element={<Home />} />
					<Route path="about" element={<About />} />
					<Route path="experience" element={<Experience />} />
					<Route path="contact" element={<About />} />
				</Route>
			</Routes>
		</BrowserRouter>
		<Analytics />
	</StrictMode>
);
