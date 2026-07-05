import { useState, useEffect } from "react";
import { getCertificates, deleteCertificate, createCertificate, uploadFile } from "@services/adminService";
import { useToast } from "@components/ui/Toast/ToastProvider";

export const useAdminCertificates = () => {
    const toast = useToast();
    const [items, setItems] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [formData, setFormData] = useState({ name: "", description: "", year: "", img: "", bg_color: "", link: "" });

    const fetchItems = async () => {
        try { setItems(await getCertificates()); } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchItems(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this certificate?")) return;
        await deleteCertificate(id);
        fetchItems();
        toast.success("Certificate deleted successfully");
    };

    const handleAddNew = () => {
        setFormData({ name: "", description: "", year: "", img: "", bg_color: "", link: "" });
        setIsFormOpen(true);
    };

    const handleImageUpload = async (e) => {
        if (!e.target.files[0]) return;
        const res = await uploadFile(e.target.files[0]);
        setFormData(prev => ({ ...prev, img: res.url }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCertificate(formData);
            setIsFormOpen(false);
            fetchItems();
            toast.success("Certificate created successfully");
        } catch (err) {
            toast.error("Failed to create certificate");
        }
    };

    return {
        items,
        isFormOpen,
        setIsFormOpen,
        formData,
        setFormData,
        handleDelete,
        handleAddNew,
        handleImageUpload,
        handleSubmit
    };
};
