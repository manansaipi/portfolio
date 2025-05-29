import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { Analytics } from "@vercel/analytics/react";

import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home/Home";
import About from "./pages/About/About.jsx";
import Experience from "./pages/Experience/Experience.jsx";
import ExperienceEntrance from "./pages/Experience/ExperienceEntrance/ExperienceEntrance.jsx";
import ExperienceDetail from "./pages/Experience/ExperienceDetail/ExperienceDetail.jsx";
import Blog from "./pages/Blog/Blog.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />}>
					{/* <Route index element={<Home />} /> */}
					<Route path="about" element={<About />} />
					<Route path="work" element={<Experience />} >
						<Route index element={<ExperienceEntrance />} />
						<Route path=":workId" element={<ExperienceDetail />} />
					</Route>
					<Route path="blog" element={<Blog />} />
					<Route path="contact" element={<Contact />} />
					<Route path="*" element={<NotFound />} /> {/* Catch-all route */}
				</Route>
			</Routes>
		</BrowserRouter>
		<Analytics />
	</StrictMode>
);
