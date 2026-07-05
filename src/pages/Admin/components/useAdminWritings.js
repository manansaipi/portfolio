import { useState, useEffect } from "react";
import { getWritings, deleteWriting, createWriting, updateWriting, uploadFile } from "@services/adminService";
import { useToast } from "@components/ui/Toast/ToastProvider";

export const useAdminWritings = () => {
    const [writings, setWritings] = useState([]);
    const [editing, setEditing] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const toast = useToast();

    const [formData, setFormData] = useState({ title: "", author: "Abdul Mannan Saipi", image: "", content: "", order: "", images: [] });

    const fetchWritings = async () => {
        try {
            const data = await getWritings();
            setWritings(data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchWritings(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this writing?")) return;
        await deleteWriting(id);
        fetchWritings();
        toast.success("Writing deleted successfully");
    };

    const handleEdit = (w) => {
        setEditing(w);
        let parsedImages = [];
        try { if (w.images) parsedImages = JSON.parse(w.images); } catch(e) {}
        
        setFormData({ 
            title: w.title, 
            author: w.author, 
            image: w.image, 
            content: w.content || "",
            order: w.order !== null && w.order !== undefined ? w.order : "",
            images: parsedImages
        });
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditing(null);
        setFormData({ title: "", author: "Abdul Mannan Saipi", image: "", content: "", order: "", images: [] });
        setIsFormOpen(true);
    };

    const handleImageUpload = async (e) => {
        if (!e.target.files[0]) return;
        const res = await uploadFile(e.target.files[0]);
        setFormData(prev => ({ ...prev, image: res.url }));
        toast.success("Image uploaded!");
    };

    const handleMultipleImageUpload = async (e) => {
        if (!e.target.files[0]) return;
        const res = await uploadFile(e.target.files[0]);
        setFormData(prev => ({ ...prev, images: [...prev.images, res.url] }));
        toast.success("Carousel image uploaded!");
    };
    
    const removeMultipleImage = (index) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };
    
    const addMultipleImageUrl = (url) => {
        if(!url) return;
        setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData };
        if (payload.order === "") payload.order = null;
        else payload.order = parseInt(payload.order, 10);
        payload.images = JSON.stringify(payload.images);

        try {
            if (editing) {
                await updateWriting(editing.id, payload);
                toast.success("Writing updated successfully");
            } else {
                await createWriting(payload);
                toast.success("Writing created successfully");
            }
            setIsFormOpen(false);
            fetchWritings();
        } catch (err) {
            toast.error("Failed to save writing");
        }
    };

    return {
        writings,
        isFormOpen,
        setIsFormOpen,
        formData,
        setFormData,
        handleDelete,
        handleEdit,
        handleAddNew,
        handleImageUpload,
        handleMultipleImageUpload,
        removeMultipleImage,
        addMultipleImageUrl,
        handleSubmit
    };
};
