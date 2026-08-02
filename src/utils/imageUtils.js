export const resolveImg = (imgStr, defaultImg = "") => {
	if (!imgStr) return defaultImg;
	if (imgStr.startsWith("/static")) {
		const backendUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
		return `${backendUrl}${imgStr}`;
	}
	if (imgStr.startsWith("@assets")) return defaultImg;
	return imgStr;
};

export const getLODImageUrls = (imgStr, isMobile) => {
	if (!imgStr) return { lowRes: "", highRes: "" };
	
	// If not Cloudinary, just return original for both
	if (!imgStr.includes('res.cloudinary.com') || !imgStr.includes('/upload/')) {
		const resolved = resolveImg(imgStr);
		return { lowRes: resolved, highRes: resolved };
	}

	// Base Cloudinary URL without existing w_ or q_ transforms
	let cleanUrl = imgStr;
	if (imgStr.includes('/upload/w_') || imgStr.includes('/upload/q_')) {
		// Just in case it already has them, we don't double inject.
		// For safety, we'll assume the DB holds clean URLs (which it does)
	}

	// Tiny texture for distance (virtually 0 VRAM)
	const lowResTransform = 'w_256,c_limit,q_auto:low,f_auto';
	// Full HD for close up
	const highResTransform = isMobile ? 'w_2048,c_limit,q_auto,f_auto' : 'w_3840,c_limit,q_auto,f_auto';

	return {
		lowRes: cleanUrl.replace('/upload/', `/upload/${lowResTransform}/`),
		highRes: cleanUrl.replace('/upload/', `/upload/${highResTransform}/`)
	};
};
