export const resolveImg = (imgStr, defaultImg = "") => {
	if (!imgStr) return defaultImg;
	if (imgStr.startsWith("/static")) {
		const backendUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
		return `${backendUrl}${imgStr}`;
	}
	
	// Cloudinary Auto-Optimization (WebP + Power of Two sizing)
	if (imgStr.includes('res.cloudinary.com') && imgStr.includes('/upload/v')) {
		return imgStr.replace('/upload/v', '/upload/q_auto,f_auto,w_1024,c_limit/v');
	}
	
	if (imgStr.startsWith("@assets")) return defaultImg;
	return imgStr;
};
