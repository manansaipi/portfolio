import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { getInstagramFeed } from "@services/instagramService";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const InstagramFeed = ({ limit = 9 }) => {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchFeed = async () => {
            const data = await getInstagramFeed(limit);
            if (data && data.length > 0) {
                setFeed(data);
            }
            setLoading(false);
        };
        fetchFeed();
    }, [limit]);

    useEffect(() => {
        if (!loading && feed.length > 0 && containerRef.current) {
            const items = containerRef.current.querySelectorAll('.ig-item');
            gsap.fromTo(items, 
                { opacity: 0, y: 50 },
                {
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8, 
                    stagger: 0.1, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%",
                    }
                }
            );
        }
    }, [loading, feed]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (feed.length === 0) return null;

    return (
        <div className="w-full" ref={containerRef}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {feed.map((post) => (
                    <a 
                        key={post.id} 
                        href={post.permalink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="ig-item group relative aspect-square overflow-hidden rounded-xl bg-neutral-900 border border-white/10"
                    >
                        <img 
                            src={post.media_type === "VIDEO" ? (post.thumbnail_url || post.media_url) : post.media_url} 
                            alt={post.caption?.substring(0, 50) || "Instagram post"} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                            <p className="text-white text-xs md:text-sm text-center line-clamp-4">
                                {post.caption || "View on Instagram"}
                            </p>
                        </div>
                        {post.media_type === "VIDEO" && (
                            <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                                    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                        {post.media_type === "CAROUSEL_ALBUM" && (
                            <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                                    <path d="M15.75 3a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-10a.75.75 0 0 1-.75-.75V3.75A.75.75 0 0 1 5.75 3h10Z" />
                                    <path d="M18.75 6.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-10a.75.75 0 0 1-.75-.75V19.5a.75.75 0 0 1-1.5 0v.75A2.25 2.25 0 0 0 8.75 22.5h10a2.25 2.25 0 0 0 2.25-2.25V7.5a.75.75 0 0 0-.75-.75h-.75A.75.75 0 0 1 18.75 6.75Z" />
                                </svg>
                            </div>
                        )}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default InstagramFeed;
