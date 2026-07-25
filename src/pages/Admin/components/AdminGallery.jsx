import React, { useState, useEffect } from "react";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton";
import { uploadFile } from "@services/admin";
import { getGalleryMedia, createGalleryMedia, deleteGalleryMedia, updateGalleryMedia, getGalleryCategories, updateGalleryCategory } from "@services/gallery";
import { resolveImg } from "@utils/imageUtils";

const AdminGallery = () => {
    const [media, setMedia] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [uploadCategory, setUploadCategory] = useState("lobby");
    const [editingMedia, setEditingMedia] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", caption: "", category: "lobby" });
    
    // Category Editing State
    const [isEditingCategories, setIsEditingCategories] = useState(false);
    const [categoryEdits, setCategoryEdits] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [mediaData, catData] = await Promise.all([
                getGalleryMedia(),
                getGalleryCategories()
            ]);
            setMedia(mediaData);
            setCategories(catData);
        } catch (error) {
            console.error("Failed to fetch gallery data", error);
        }
    };

    const fetchMedia = async () => {
        try {
            const data = await getGalleryMedia();
            setMedia(data);
        } catch (error) {
            console.error("Failed to fetch gallery media", error);
        }
    };

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        setLoading(true);
        
        let successCount = 0;
        try {
            for (const file of files) {
                // Upload to cloudinary
                const res = await uploadFile(file, "scrapbook_uploads");
                
                // Determine type
                const isVideo = file.type.startsWith('video/');
                
                // Automatically create DB entry
                await createGalleryMedia({
                    url: res.url,
                    caption: null,
                    category: uploadCategory === "lobby" ? null : uploadCategory,
                    media_type: isVideo ? "video" : "image",
                    order: null
                });
                successCount++;
            }
            setIsFormOpen(false);
            fetchMedia();
            alert(`Successfully uploaded ${successCount} files!`);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Some uploads failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEdit = (m) => {
        setEditingMedia(m.id);
        setEditForm({
            title: m.title || "",
            caption: m.caption || "",
            category: m.category || "lobby"
        });
    };

    const handleSaveEdit = async () => {
        try {
            await updateGalleryMedia(editingMedia, {
                title: editForm.title,
                caption: editForm.caption,
                category: editForm.category === "lobby" ? null : editForm.category
            });
            setEditingMedia(null);
            fetchMedia();
        } catch (error) {
            console.error("Failed to update media", error);
            alert("Failed to update media.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this photo/video?")) return;
        try {
            await deleteGalleryMedia(id);
            fetchMedia();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const handleSaveCategories = async () => {
        try {
            for (const [slug, newLabel] of Object.entries(categoryEdits)) {
                if (newLabel.trim()) {
                    await updateGalleryCategory(slug, { label: newLabel.trim() });
                }
            }
            await fetchData();
            setIsEditingCategories(false);
            setCategoryEdits({});
        } catch (error) {
            console.error("Failed to update categories", error);
            alert("Failed to update categories");
        }
    };

    const startEditingCategories = () => {
        const edits = {};
        categories.forEach(c => edits[c.slug] = c.label);
        setCategoryEdits(edits);
        setIsEditingCategories(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold">Scrapbook Gallery</h2>
                <div className="flex gap-4">
                    <PrimaryButton label="Manage Categories" handleOnClick={startEditingCategories} />
                    <PrimaryButton label="Upload Media" handleOnClick={() => setIsFormOpen(true)} />
                </div>
            </div>

            {isEditingCategories && (
                <div className="mb-10 p-6 border border-light-dark rounded-xl flex flex-col gap-6 bg-background/50">
                    <div className="flex flex-col gap-3 p-4 border border-light-dark rounded-md bg-background">
                        <label className="font-bold border-b border-light-dark pb-2">Edit Museum Halls (Categories):</label>
                        <p className="text-xs opacity-70 mb-2">Rename the 4 physical halls of your 3D museum.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categories.map(cat => (
                                <div key={cat.slug} className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold capitalize opacity-70">Hall: {cat.slug}</label>
                                    <input 
                                        type="text"
                                        value={categoryEdits[cat.slug] || ""}
                                        onChange={(e) => setCategoryEdits({...categoryEdits, [cat.slug]: e.target.value})}
                                        className="p-2 bg-light-dark text-primary border border-light-dark rounded-md cursor-none w-full"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 mt-2">
                        <button type="button" onClick={() => setIsEditingCategories(false)} className="px-6 py-2 border border-light-dark rounded-md hover:bg-light-dark transition-colors cursor-none">Cancel</button>
                        <PrimaryButton label="Save Names" handleOnClick={handleSaveCategories} />
                    </div>
                </div>
            )}

            {isFormOpen && (
                <div className="mb-10 p-6 border border-light-dark rounded-xl flex flex-col gap-6 bg-background/50">
                    <div className="flex flex-col gap-3 p-4 border border-light-dark rounded-md bg-background">
                        <label className="font-bold border-b border-light-dark pb-2">Upload Multiple Photos/Videos:</label>
                        
                        <div className="flex flex-col gap-2 mb-2">
                            <label className="text-sm font-semibold">Assign Category (Halls):</label>
                            <select 
                                value={uploadCategory} 
                                onChange={(e) => setUploadCategory(e.target.value)}
                                className="p-2 bg-light-dark text-primary border border-light-dark rounded-md cursor-none"
                            >
                                <option value="lobby">Lobby (Uncategorized / Floating Centerpiece)</option>
                                {categories.map(cat => (
                                    <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                                ))}
                            </select>
                            <span className="text-xs opacity-50">Artworks will be automatically mounted to picture frames in the selected hall.</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <input 
                                type="file" 
                                multiple 
                                onChange={handleUpload} 
                                accept="image/*,video/*" 
                                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-light-dark file:text-primary hover:file:bg-opacity-80 cursor-none" 
                                disabled={loading} 
                            />
                            <span className="text-xs opacity-50">Select multiple files to upload them instantly.</span>
                        </div>
                        {loading && <div className="text-sm text-primary font-bold animate-pulse">Uploading and processing files... Please wait...</div>}
                    </div>

                    <div className="flex gap-4 mt-2">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2 border border-light-dark rounded-md hover:bg-light-dark transition-colors cursor-none">Close</button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingMedia && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-background border border-light-dark p-6 rounded-xl w-full max-w-md flex flex-col gap-4 shadow-xl">
                        <h3 className="text-xl font-bold border-b border-light-dark pb-2">Edit Artwork</h3>
                        
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold">Title</label>
                            <input 
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                className="p-2 bg-light-dark text-primary border border-light-dark rounded-md cursor-none w-full"
                                placeholder="Artwork Title"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold">Caption</label>
                            <input 
                                type="text"
                                value={editForm.caption}
                                onChange={(e) => setEditForm({...editForm, caption: e.target.value})}
                                className="p-2 bg-light-dark text-primary border border-light-dark rounded-md cursor-none w-full"
                                placeholder="Short description"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold">Category (Hall)</label>
                            <select 
                                value={editForm.category}
                                onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                                className="p-2 bg-light-dark text-primary border border-light-dark rounded-md cursor-none w-full"
                            >
                                <option value="lobby">Lobby (Uncategorized)</option>
                                {categories.map(cat => (
                                    <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setEditingMedia(null)} className="px-4 py-2 border border-light-dark rounded-md hover:bg-light-dark cursor-none transition-colors">Cancel</button>
                            <PrimaryButton label="Save Changes" handleOnClick={handleSaveEdit} />
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {media.map(m => (
                    <div key={m.id} className="relative group border border-light-dark rounded p-2 flex flex-col gap-2 bg-background">
                        {m.media_type === "image" ? (
                            <img src={resolveImg(m.url)} alt="gallery" className="h-40 w-full object-cover rounded" />
                        ) : (
                            <video src={resolveImg(m.url)} className="h-40 w-full object-cover rounded" />
                        )}
                        <div className="flex flex-col gap-1 mt-1">
                            <div className="text-sm font-bold text-center truncate">{m.title || "Untitled"}</div>
                            {m.caption && <div className="text-xs text-center italic truncate opacity-70">{m.caption}</div>}
                            <div className="text-[10px] text-center uppercase tracking-wider bg-light-dark rounded py-0.5 mt-1 opacity-80">
                                {categories.find(c => c.slug === m.category)?.label || "Lobby"}
                            </div>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1 transition-opacity">
                            <button 
                                onClick={() => handleOpenEdit(m)} 
                                className="bg-blue-600 text-white p-1.5 rounded cursor-none text-xs shadow-md hover:bg-blue-500"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => handleDelete(m.id)} 
                                className="bg-red-500 text-white p-1.5 rounded cursor-none text-xs shadow-md hover:bg-red-400"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminGallery;
