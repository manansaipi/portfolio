import { useState, useEffect } from "react";
import { getWritings, deleteWriting, createWriting, updateWriting, uploadFile } from "@services/adminService";
import { useToast } from "@components/ui/Toast/ToastProvider";

export const useAdminWritings = () => {
    const [writings, setWritings] = useState([]);
    const [editing, setEditing] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const toast = useToast();

    const [formData, setFormData] = useState({ title: "", author: "Abdul Mannan Saipi", image: "", content: "" });

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
        setFormData({ title: w.title, author: w.author, image: w.image, content: w.content || "" });
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditing(null);
        setFormData({ title: "", author: "Abdul Mannan Saipi", image: "", content: "" });
        setIsFormOpen(true);
    };

    const handleImageUpload = async (e) => {
        if (!e.target.files[0]) return;
        const res = await uploadFile(e.target.files[0]);
        setFormData(prev => ({ ...prev, image: res.url }));
        toast.success("Image uploaded!");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await updateWriting(editing.id, formData);
                toast.success("Writing updated successfully");
            } else {
                await createWriting(formData);
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
        handleSubmit
    };
};
