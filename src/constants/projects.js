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
		embedUrl: import.meta.env.DEV ? 'http://localhost:5173/?embed=true&autoScroll=true' : 'https://manansaipi.com/?embed=true&autoScroll=true',
		autoScrollMode: "internal", // Uses JS inside the iframe to scroll itself
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
		url: "https://manansaipi.github.io/roti-li-doku",
		embedUrl: "https://manansaipi.github.io/roti-li-doku?autoScroll=true",
		autoScrollMode: "internal",
	},
	{
		id: "audio-vision",
		title: "Audio Vision",
		description: "A Voice-Based Navigation App for the Visually Impaired, developed as a capstone project. It enhances mobility, safety, and independence through smart voice-based navigation and real-time object detection.",
		techStack: ["Flutter", "React", "Tailwind", "YOLO", "Firebase", "Google Maps API"],
		features: [
			{ title: "Voice-Guided Navigation", desc: "Turn-by-turn auditory directions to guide users safely to their destination." },
			{ title: "Real-Time Object Detection", desc: "Advanced AI detects obstacles and provides immediate auditory feedback." },
			{ title: "Haptic Feedback", desc: "Multi-sensory vibrations for physical feedback and spatial awareness." },
			{ title: "Multi-Language Voice Commands", desc: "Speak naturally globally with automated voice commands." }
		],
		url: "https://fp-capstone.github.io/audio-vision-web/",
		embedUrl: "https://fp-capstone.github.io/audio-vision-web/?autoScroll=true",
		autoScrollMode: "internal",
	}
];
