const trackPageVisit = async (pathname, userAgent) => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + "/api/analytics", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pathname,
                userAgent
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (err) {
        console.error("Tracking failed:", err);
    }
};

export {
    trackPageVisit
};
