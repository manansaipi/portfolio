import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { Analytics } from "@vercel/analytics/react";

import "@/index.css";
import App from "@/App.jsx";
import Home from "@pages/Home/Home";
import About from "@pages/About/About.jsx";
import Experience from "@pages/Experience/Experience.jsx";
import ExperienceEntrance from "@pages/Experience/components/ExperienceEntrance/ExperienceEntrance.jsx";
import ExperienceDetail from "@pages/Experience/components/ExperienceDetail/ExperienceDetail.jsx";
import Blog from "@pages/Blog/Blog.jsx";
import Contact from "@pages/Contact/Contact.jsx";
import NotFound from "@pages/NotFound/NotFound.jsx";
import AllBlog from "@pages/Blog/components/AllBlog/AllBlog.jsx";
import BlogDetail from "@pages/Blog/components/BlogDetail/BlogDetail.jsx";
import Projects from "@pages/Projects/Projects.jsx";
import AdminPanel from "@pages/Admin/AdminPanel.jsx";
import { ToastProvider } from "@components/ui/Toast/ToastProvider";

import ProtectedRoute from "@components/ui/ProtectedRoute/ProtectedRoute";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<ToastProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/dashboard-secret" element={
						<ProtectedRoute>
							<AdminPanel />
						</ProtectedRoute>
					} />
					<Route path="/" element={<App />}>
						<Route path="about" element={<About />} />
						<Route path="work" element={<Experience />}>
							<Route index element={<ExperienceEntrance />} />
							<Route path=":workId" element={<ExperienceDetail />} />
						</Route>
						<Route path="blog" element={<Blog />}>
							<Route index element={<AllBlog />} />
							<Route path=":blogId" element={<BlogDetail />} />
						</Route>
						<Route path="projects" element={<Projects />} />
						<Route path="contact" element={<Contact />} />
						<Route path="*" element={<NotFound />} /> {/* Catch-all route */}
					</Route>
				</Routes>
			</BrowserRouter>
		</ToastProvider>
		<Analytics />
	</StrictMode>
);
