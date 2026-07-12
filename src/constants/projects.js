const PORTFOLIO_URL = window.location.origin;

export const PROJECTS = [
	{
		id: "portfolio",
		title: "Personal Portfolio",
		description: "A thoughtfully crafted portfolio showcasing my journey as a software engineer — featuring smooth animations, an AI-powered terminal, and a full-stack blog system.",
		techStack: ["React", "Tailwind CSS", "GSAP", "FastAPI", "MySQL"],
		features: [
			{ title: "AI-Powered Terminal", desc: "Interactive command-line interface mimicking real terminal commands." },
			{ title: "Full-Stack Blog", desc: "Markdown-supported blog engine connected to a FastAPI backend." },
			{ title: "Fluid Animations", desc: "Awwwards-winning level smooth scrolling and GSAP staggered entrances." },
		],
		githubUrl: "https://github.com/manansaipi/portfolio",
		embedUrl: import.meta.env.DEV ? 'http://localhost:5173/?embed=true&autoScroll=true' : 'https://manansaipi.com/?embed=true&autoScroll=true',
		autoScrollMode: "internal",
	},
	{
		id: "audio-vision",
		title: "Audio Vision",
		description: "A Voice-Based Navigation App for the Visually Impaired, developed as a capstone project. It enhances mobility, safety, and independence through smart voice-based navigation and real-time object detection.",
		techStack: ["Flutter", "Dart", "YOLOv8", "TensorFlow Lite", "Google Maps API", "Google Directions API", "Google Places API", "Speech-to-Text", "Text-to-Speech", "Firebase Realtime Database", "Firebase Authentication", "Express.js", "Node.js"],
		features: [
			{ title: "Voice-Guided Navigation", desc: "Turn-by-turn auditory directions to guide users safely to their destination." },
			{ title: "Real-Time Object Detection", desc: "Advanced AI detects obstacles and provides immediate auditory feedback." },
			{ title: "Haptic Feedback", desc: "Multi-sensory vibrations for physical feedback and spatial awareness." },
			{ title: "Multi-Language Voice Commands", desc: "Speak naturally globally with automated voice commands." }
		],
		githubUrl: "https://github.com/FP-CAPSTONE/AudioVision",
		url: "https://fp-capstone.github.io/audio-vision-web/",
		embedUrl: "https://fp-capstone.github.io/audio-vision-web/?autoScroll=true",
		autoScrollMode: "internal",
	},
	{
		id: "netflix-clone",
		title: "Netflix Clone",
		description: "A full-featured Netflix clone allowing users to search and discover movies seamlessly using the TMDB API, featuring custom interactive animations and a robust FastAPI backend for user authentication and managing favorite movies.",
		techStack: ["React", "TypeScript", "Tailwind CSS", "Vite", "React Router", "FastAPI", "MySQL", "JWT"],
		features: [
			{ title: "Movie Search", desc: "Real-time movie search utilizing the TMDB (IMDB) API." },
			{ title: "Interactive UI", desc: "Netflix-inspired interface with responsive carousels and detail modals." },
			{ title: "User Authentication", desc: "Secure login and registration system using JWT." },
			{ title: "Favorite Movies", desc: "Save and manage favorite movies seamlessly with a FastAPI and MySQL backend." },
			{ title: "Automated Demo", desc: "Custom simulated user interactions and fake cursor sequence." }
		],
		githubUrl: "https://github.com/manansaipi/s-frontend",
		url: "https://s-frontend-omega.vercel.app/",
		embedUrl: "https://s-frontend-omega.vercel.app/?autoScroll=true",
		autoScrollMode: "internal",
	},
	{
		id: "todo-list-app",
		title: "To-Do List App",
		description: "A powerful mobile productivity application featuring location-based tracking, smart notifications, and an intuitive timeline view. Built with Flutter and integrated with Google Maps.",
		techStack: ["Flutter", "Dart", "SQFLite", "Google Maps API"],
		features: [
			{ title: "Location-Based Tracking", desc: "Integrate Google Maps to attach specific locations to each task and view them on an interactive map." },
			{ title: "Intuitive Task Management", desc: "Create tasks with rich details and view your day on a beautiful timeline aligned with your schedule." },
			{ title: "Smart Notifications", desc: "Set wake-up/sleep times and receive timely, non-intrusive notifications for scheduled tasks." },
			{ title: "Comfortable Dark Mode", desc: "Toggle dark mode for a comfortable viewing experience day or night." }
		],
		githubUrl: "https://github.com/manansaipi/todo-app-landing-page",
		url: "https://manansaipi.github.io/todo-app-landing-page/",
		embedUrl: "https://manansaipi.github.io/todo-app-landing-page/?autoScroll=true",
		autoScrollMode: "internal",
	},
	{
		id: "roti-li-doku",
		title: "Roti Li Doku",
		description: "A premium bakery landing page with canvas image sequence animations, seamless scroll effects, and modern aesthetics.",
		techStack: ["React", "Tailwind CSS", "Framer Motion", "Vite", "Lenis"],
		features: [
			{ title: "Canvas Sequence", desc: "High-performance scroll-linked 192-frame image sequence." },
			{ title: "Smooth Scrolling", desc: "Integrated Lenis for buttery smooth scroll interpolation." },
			{ title: "Bento Grid Gallery", desc: "Aesthetic asymmetrical image gallery with hover effects." },
			{ title: "Scrollytelling", desc: "Framer Motion powered elements that reveal beautifully on scroll." }
		],
		githubUrl: "https://github.com/manansaipi/roti-li-doku",
		url: "https://manansaipi.github.io/roti-li-doku",
		embedUrl: "https://manansaipi.github.io/roti-li-doku?autoScroll=true",
		autoScrollMode: "internal",
	},
	{
		id: "serfee-api",
		title: "Serfee API",
		description: "A location-based help request and task marketplace backend for communities to request and offer assistance with daily tasks. Features geofencing, real-time chat, and a robust offer/response system.",
		techStack: ["Express.js", "Node.js", "Google Cloud Platform (GCP)", "Cloud MySQL", "Cloud Storage", "App Engine", "Cloud Run", "Docker"],
		features: [
			{ title: "Location-Based Services", desc: "Fetch nearby tasks based on latitude, longitude, and radius using the Haversine formula." },
			{ title: "Offer & Response System", desc: "Marketplace system allowing taskers to submit offers and posters to accept or reject." },
			{ title: "Real-time Messaging", desc: "Integrated real-time chat system via Firebase Realtime Database." },
			{ title: "Task Management", desc: "Create, update, and search tasks with image upload to Cloud Storage." }
		],
		githubUrl: "https://github.com/Serfee/Cloud-Computing",
		url: "https://serfee.github.io/serfee-api-web/",
		embedUrl: "https://serfee.github.io/serfee-api-web/?autoScroll=true",
		autoScrollMode: "internal",
	},
	
];
