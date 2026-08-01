export const resolveImg = (imgStr, defaultImg = "") => {
	if (!imgStr) return defaultImg;
	if (imgStr.startsWith("/static")) {
		const backendUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
		return `${backendUrl}${imgStr}`;
	}
	if (imgStr.startsWith("@assets")) return defaultImg;
	return imgStr;
};
