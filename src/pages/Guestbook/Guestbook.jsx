import React, { useEffect, useState, useRef, useContext } from "react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import dayjs from "dayjs";
import { getGuestbookEntries, createGuestbookEntry, updateGuestbookEntry, deleteGuestbookEntry } from "@services/guestbook";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton";
import { AppContext } from "@/App";
import { Helmet } from "react-helmet-async";

const Guestbook = () => {
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: "", message: "" });
    const [editingEntryId, setEditingEntryId] = useState(null);
    const [editingMessage, setEditingMessage] = useState("");
    
    const { addToast } = useToast();
    const { handleButtonNavigation, isAdmin } = useContext(AppContext);

    const pageRef = useRef();
    const gridRef = useRef();

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const data = await getGuestbookEntries();
                setEntries(data);
            } catch (error) {
                console.error("Failed to fetch guestbook:", error);
                addToast("Failed to load guestbook entries.", "error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchEntries();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            let ctx = gsap.context(() => {
                gsap.fromTo(
                    ".page-title",
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 1, ease: "power4.out", delay: 0.2 }
                );
                
                if (gridRef.current && gridRef.current.children.length > 0) {
                    gsap.fromTo(
                        gridRef.current.children,
                        { opacity: 0, y: 30 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            stagger: 0.1,
                            ease: "power3.out",
                            delay: 0.5
                        }
                    );
                }
            }, pageRef);
            return () => ctx.revert();
        }
    }, [isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.message.trim()) {
            addToast("Name and message are required.", "warning");
            return;
        }

        setIsSubmitting(true);
        try {
            const newEntry = await createGuestbookEntry(formData);
            setEntries([newEntry, ...entries]);
            setFormData({ name: "", message: "" });
            addToast("Your message has been posted!", "success");
        } catch (error) {
            console.error("Failed to post message:", error);
            addToast("Failed to post message. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await deleteGuestbookEntry(id);
            setEntries(entries.filter(entry => entry.id !== id));
            addToast("Message deleted.", "success");
        } catch (error) {
            console.error("Failed to delete:", error);
            addToast("Failed to delete message.", "error");
        }
    };

    const startEditing = (entry) => {
        setEditingEntryId(entry.id);
        setEditingMessage(entry.message);
    };

    const handleEditSubmit = async (id) => {
        if (!editingMessage.trim()) {
            addToast("Message cannot be empty.", "warning");
            return;
        }
        try {
            const updated = await updateGuestbookEntry(id, { message: editingMessage });
            setEntries(entries.map(e => e.id === id ? updated : e));
            setEditingEntryId(null);
            setEditingMessage("");
            addToast("Message updated.", "success");
        } catch (error) {
            console.error("Failed to update:", error);
            addToast("Failed to update message.", "error");
        }
    };

    return (
        <div ref={pageRef} className="bg-background min-h-screen text-primary pt-32 pb-20">
            <Helmet>
                <title>Guestbook | Abdul Mannan Saipi</title>
                <meta name="description" content="Leave a message on my public guestbook." />
            </Helmet>

            <div className="container mx-auto px-5 md:px-10 lg:px-20 mb-20">
                <div className="text-center mb-16">
                    <h1 className="page-title text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter">
                        Public <br/><span className="text-color-text-hovering font-light italic">Guestbook</span>
                    </h1>
                    <p className="page-title mt-6 text-color-text-hovering max-w-xl mx-auto">
                        Leave a note, say hello, or just sign your name. It's always nice to know who dropped by!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 bg-primary/5 border border-primary/10 rounded-2xl p-8 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold mb-6 tracking-tight">Sign the Guestbook</h2>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold tracking-wider text-color-text-hovering uppercase mb-2">Name</label>
                                    <input 
                                        type="text" 
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        maxLength={100}
                                        className="w-full bg-transparent border-b border-primary/20 text-primary py-3 focus:outline-none focus:border-primary transition-colors cursor-text"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold tracking-wider text-color-text-hovering uppercase mb-2">Message</label>
                                    <textarea 
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        maxLength={500}
                                        rows={4}
                                        className="w-full bg-transparent border border-primary/20 rounded-lg text-primary p-4 focus:outline-none focus:border-primary transition-colors resize-none cursor-text"
                                        placeholder="Your awesome message here..."
                                        required
                                    />
                                    <div className="text-right text-xs text-color-text-hovering mt-2">
                                        {formData.message.length}/500
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className={`w-full py-4 font-semibold tracking-widest uppercase border border-primary/20 rounded-lg transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-background cursor-none'}`}
                                >
                                    {isSubmitting ? 'Posting...' : 'Post Message'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Messages Grid */}
                    <div className="lg:col-span-2">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                            </div>
                        ) : entries.length === 0 ? (
                            <div className="text-center py-20 border border-dashed border-primary/20 rounded-2xl">
                                <p className="text-color-text-hovering text-lg">No messages yet. Be the first to sign!</p>
                            </div>
                        ) : (
                            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {entries.map((entry) => (
                                    <div key={entry.id} className="bg-primary/5 border border-primary/10 rounded-2xl p-6 hover:bg-primary/10 transition-colors duration-300 relative group">
                                        {isAdmin && (
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => startEditing(entry)} className="text-color-text-hovering hover:text-primary text-sm cursor-none">Edit</button>
                                                <button onClick={() => handleDelete(entry.id)} className="text-red-500 hover:text-red-700 text-sm cursor-none">Delete</button>
                                            </div>
                                        )}
                                        {editingEntryId === entry.id ? (
                                            <div className="mb-6">
                                                <textarea
                                                    value={editingMessage}
                                                    onChange={(e) => setEditingMessage(e.target.value)}
                                                    className="w-full bg-transparent border border-primary/20 rounded-lg text-primary p-3 focus:outline-none focus:border-primary resize-none cursor-text text-sm mb-2"
                                                    rows={3}
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setEditingEntryId(null)} className="text-xs text-color-text-hovering cursor-none hover:text-primary">Cancel</button>
                                                    <button onClick={() => handleEditSubmit(entry.id)} className="text-xs bg-primary text-background px-3 py-1 rounded cursor-none">Save</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-primary text-lg mb-6 leading-relaxed whitespace-pre-wrap pr-10">{entry.message}</p>
                                        )}
                                        <div className="flex justify-between items-end border-t border-primary/10 pt-4 mt-auto">
                                            <span className="font-bold text-sm tracking-widest uppercase">{entry.name}</span>
                                            <span className="text-xs text-color-text-hovering">{dayjs(entry.created_at).format("MMM D, YYYY")}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Guestbook;
