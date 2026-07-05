import { useState, useEffect } from "react";
import { getExperiences, deleteExperience, createExperience, updateExperience, uploadFile } from "@services/adminService";
import { useToast } from "@components/ui/Toast/ToastProvider";

export const useAdminExperiences = () => {
    const toast = useToast();
    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState(null); 
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [formData, setFormData] = useState({ company: "", position: "", description: "", start_date: "", end_date: "", img: "", points: "" });

    const fetchItems = async () => {
        try { setItems(await getExperiences()); } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchItems(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this experience?")) return;
        await deleteExperience(id);
        fetchItems();
        toast.success("Experience deleted successfully");
    };

    const handleEdit = (w) => {
        setEditing(w);
        setFormData({ 
            company: w.company, 
            position: w.position, 
            description: w.description, 
            start_date: w.start_date, 
            end_date: w.end_date, 
            img: w.img,
            points: (w.points || "")
        });
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditing(null);
        setFormData({ company: "", position: "", description: "", start_date: "", end_date: "", img: "", points: "" });
        setIsFormOpen(true);
    };

    const handleImageUpload = async (e) => {
        if (!e.target.files[0]) return;
        const res = await uploadFile(e.target.files[0]);
        setFormData(prev => ({ ...prev, img: res.url }));
        toast.success("Image uploaded!");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData };
        try {
            if (editing) {
                await updateExperience(editing.id, payload);
                toast.success("Experience updated successfully");
            } else {
                await createExperience(payload);
                toast.success("Experience created successfully");
            }
            setIsFormOpen(false);
            fetchItems();
        } catch (err) {
            toast.error("Failed to save experience");
        }
    };

    return {
        items,
        editing,
        isFormOpen,
        setIsFormOpen,
        formData,
        setFormData,
        handleDelete,
        handleEdit,
        handleAddNew,
        handleImageUpload,
        handleSubmit
    };
};
