import React, { useState, useEffect } from "react";
import { getCertificates, deleteCertificate, createCertificate, uploadFile } from "@services/adminService";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton";
import { useToast } from "@components/ui/Toast/ToastProvider";

const AdminCertificates = () => {
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

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold">Certificates</h2>
                <PrimaryButton label="Add New" handleOnClick={handleAddNew} />
            </div>

            {isFormOpen && (
                <form onSubmit={handleSubmit} className="mb-10 p-5 border border-light-dark rounded flex flex-col gap-4">
                    <input className="bg-transparent border-b p-2 outline-none" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    <input className="bg-transparent border-b p-2 outline-none" placeholder="Description / Issuer" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    <input className="bg-transparent border-b p-2 outline-none" placeholder="Year (e.g., 2024)" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required />
                    <input className="bg-transparent border-b p-2 outline-none" placeholder="Link (Optional)" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
                    <input className="bg-transparent border-b p-2 outline-none" placeholder="Background Color (Optional)" value={formData.bg_color} onChange={e => setFormData({...formData, bg_color: e.target.value})} />
                    
                    <div className="flex flex-col gap-2">
                        <label>Image URL or Upload:</label>
                        <input className="bg-transparent border-b p-2 outline-none" placeholder="Image URL" value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} />
                        <input type="file" onChange={handleImageUpload} />
                        {formData.img && <img src={formData.img.startsWith("/static") ? `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${formData.img}` : formData.img} alt="preview" className="h-20 w-32 object-cover" />}
                    </div>
                    
                    <div className="flex gap-4">
                        <button type="submit" className="px-4 py-2 bg-white text-black font-bold rounded cursor-none">Save</button>
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border rounded cursor-none">Cancel</button>
                    </div>
                </form>
            )}

            <div className="flex flex-col gap-4">
                {items.map(w => (
                    <div key={w.id} className="flex justify-between items-center border border-light-dark p-4 rounded hover:bg-light-dark transition-colors">
                        <div className="flex gap-4 items-center">
                            {w.img && <img src={w.img.startsWith("/static") ? `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${w.img}` : w.img} className="h-10 w-16 object-cover" />}
                            <div>
                                <div className="font-bold">{w.name}</div>
                                <div className="text-sm opacity-50">{w.description} - {w.year}</div>
                            </div>
                        </div>
                        <div className="flex gap-4 cursor-none">
                            <div onClick={() => handleDelete(w.id)} className="hover:text-red-400">Delete</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminCertificates;
