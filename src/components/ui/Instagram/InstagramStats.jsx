import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { getInstagramStats } from "@services/instagramService";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const InstagramStats = () => {
    const [stats, setStats] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getInstagramStats();
            if (data) {
                setStats(data);
            }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        if (stats && containerRef.current) {
            gsap.fromTo(containerRef.current,
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 90%",
                    }
                }
            );
        }
    }, [stats]);

    if (!stats) return null;

    return (
        <div ref={containerRef} className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-neutral-900 border border-white/10 w-full mb-8">
            {stats.profile_picture_url && (
                <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden border-2 border-primary p-1">
                    <img src={stats.profile_picture_url} alt={stats.name} className="w-full h-full object-cover rounded-full" />
                </div>
            )}
            <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-white mb-1">{stats.name}</h3>
                <a 
                    href="https://instagram.com/manansaipi" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sm text-primary hover:underline"
                >
                    @manansaipi
                </a>
            </div>
            <div className="flex gap-6 mt-4 sm:mt-0 text-center">
                <div>
                    <div className="text-2xl font-black text-white">{stats.followers_count?.toLocaleString()}</div>
                    <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Followers</div>
                </div>
                <div>
                    <div className="text-2xl font-black text-white">{stats.follows_count?.toLocaleString()}</div>
                    <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Following</div>
                </div>
                <div>
                    <div className="text-2xl font-black text-white">{stats.media_count?.toLocaleString()}</div>
                    <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Posts</div>
                </div>
            </div>
        </div>
    );
};

export default InstagramStats;
