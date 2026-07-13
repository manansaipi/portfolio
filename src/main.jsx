import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { Analytics } from "@vercel/analytics/react";

import "@/index.css";
import App from "@/App.jsx";
import { ToastProvider } from "@components/ui/Toast/ToastProvider";
import ProtectedRoute from "@components/ui/ProtectedRoute/ProtectedRoute";

// Lazy-loaded routes
const Home = lazy(() => import("@pages/Home/Home"));
const About = lazy(() => import("@pages/About/About.jsx"));
const Experience = lazy(() => import("@pages/Experience/Experience.jsx"));
const ExperienceEntrance = lazy(() => import("@pages/Experience/components/ExperienceEntrance/ExperienceEntrance.jsx"));
const ExperienceDetail = lazy(() => import("@pages/Experience/components/ExperienceDetail/ExperienceDetail.jsx"));
const Blog = lazy(() => import("@pages/Blog/Blog.jsx"));
const Contact = lazy(() => import("@pages/Contact/Contact.jsx"));
const NotFound = lazy(() => import("@pages/NotFound/NotFound.jsx"));
const AllBlog = lazy(() => import("@pages/Blog/components/AllBlog/AllBlog.jsx"));
const BlogDetail = lazy(() => import("@pages/Blog/components/BlogDetail/BlogDetail.jsx"));
const Projects = lazy(() => import("@pages/Projects/Projects.jsx"));
const Guestbook = lazy(() => import("@pages/Guestbook/Guestbook.jsx"));
const AdminPanel = lazy(() => import("@pages/Admin/AdminPanel.jsx"));

import { HelmetProvider } from 'react-helmet-async';

const LoadingFallback = () => (
    <div className="flex h-screen w-full items-center justify-center bg-background text-primary">
        <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <div className="text-sm font-bold tracking-widest uppercase opacity-50">Loading...</div>
        </div>
    </div>
);

createRoot(document.getElementById("root")).render(
	<StrictMode>
        <HelmetProvider>
            <ToastProvider>
			<BrowserRouter>
                <Suspense fallback={<LoadingFallback />}>
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
                            <Route path="guestbook" element={<Guestbook />} />
                            <Route path="contact" element={<Contact />} />
                            <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
                        </Route>
                    </Routes>
                </Suspense>
			</BrowserRouter>
		</ToastProvider>
        </HelmetProvider>
		<Analytics />
	</StrictMode>
);
