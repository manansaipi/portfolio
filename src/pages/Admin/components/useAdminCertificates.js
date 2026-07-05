import { useState, useEffect } from "react";
import { getCertificates, deleteCertificate, createCertificate, updateCertificate, uploadFile } from "@services/adminService";
import { useToast } from "@components/ui/Toast/ToastProvider";

export const useAdminCertificates = () => {
    const toast = useToast();
    const [items, setItems] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const [formData, setFormData] = useState({ name: "", description: "", year: "", img: "", bg_color: "", link: "", order: "" });

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
        setEditing(null);
        setFormData({ name: "", description: "", year: "", img: "", bg_color: "", link: "", order: "" });
        setIsFormOpen(true);
    };

    const handleEdit = (cert) => {
        setEditing(cert.id);
        setFormData({
            name: cert.name,
            description: cert.description,
            year: cert.year,
            img: cert.img || "",
            bg_color: cert.bg_color || "",
            link: cert.link || "",
            order: cert.order !== null ? cert.order : ""
        });
        setIsFormOpen(true);
    };

    const handleImageUpload = async (e) => {
        if (!e.target.files[0]) return;
        const res = await uploadFile(e.target.files[0]);
        setFormData(prev => ({ ...prev, img: res.url }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData };
        if (payload.order === "") payload.order = null;
        else payload.order = parseInt(payload.order, 10);
        
        try {
            if (editing) {
                await updateCertificate(editing, payload);
                toast.success("Certificate updated successfully");
            } else {
                await createCertificate(payload);
                toast.success("Certificate created successfully");
            }
            setIsFormOpen(false);
            fetchItems();
        } catch (err) {
            toast.error(editing ? "Failed to update certificate" : "Failed to create certificate");
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
        handleEdit,
        handleImageUpload,
        handleSubmit
    };
};
