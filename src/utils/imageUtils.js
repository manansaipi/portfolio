export const resolveImg = (imgStr, defaultImg = "") => {
	if (!imgStr) return defaultImg;
	if (imgStr.startsWith("/static")) {
		const backendUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
		return `${backendUrl}${imgStr}`;
	}
	if (imgStr.startsWith("@assets")) return defaultImg;
	return imgStr;
};

// Optimizes Cloudinary URLs specifically for WebGL textures to prevent GPU VRAM crashes on mobile
export const resolveTextureImg = (imgStr, defaultImg = "") => {
    let url = resolveImg(imgStr, defaultImg);
    if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
        // 1024px max dimension, maintain aspect ratio, force WebP, auto quality
        return url.replace("/upload/", "/upload/w_1024,c_limit,f_webp,q_auto/");
    }
    return url;
};
