export const resolveImg = (imgStr, defaultImg = "") => {
	if (!imgStr) return defaultImg;
	if (imgStr.startsWith("/static")) {
		const backendUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
		return `${backendUrl}${imgStr}`;
	}
	if (imgStr.startsWith("@assets")) return defaultImg;

	// Automatically optimize Cloudinary images to prevent VRAM crashes on mobile
	if (imgStr.includes('res.cloudinary.com') && imgStr.includes('/upload/')) {
		const isMobile = typeof window !== 'undefined' && (window.innerWidth <= 1024 || 'ontouchstart' in window);
		// On mobile, cap texture width to 1024px and use auto compression. On desktop, cap at 2048px.
		const transform = isMobile ? 'w_1024,c_limit,q_auto,f_auto' : 'w_2048,c_limit,q_auto,f_auto';
		
		// Don't inject if it already has transformations (like w_ or q_)
		if (!imgStr.includes('/upload/w_') && !imgStr.includes('/upload/q_')) {
			return imgStr.replace('/upload/', `/upload/${transform}/`);
		}
	}

	return imgStr;
};
