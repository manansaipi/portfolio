import React, { useState, useEffect } from "react";
import { getExperiences, deleteExperience, createExperience, updateExperience, uploadFile } from "@services/adminService";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton";

const AdminExperiences = () => {
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData };
        if (editing) {
            await updateExperience(editing.id, payload);
        } else {
            await createExperience(payload);
        }
        setIsFormOpen(false);
        fetchItems();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold">Experiences / Works</h2>
                <PrimaryButton label="Add New" handleOnClick={handleAddNew} />
            </div>

            {isFormOpen && (
                <form onSubmit={handleSubmit} className="mb-10 p-5 border border-light-dark rounded flex flex-col gap-4">
                    <input className="bg-transparent border-b p-2 outline-none" placeholder="Company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
                    <input className="bg-transparent border-b p-2 outline-none" placeholder="Position" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} required />
                    <div className="flex gap-4">
                        <input className="bg-transparent border-b p-2 outline-none w-1/2" placeholder="Start Date (e.g., Jan 2024)" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required />
                        <input className="bg-transparent border-b p-2 outline-none w-1/2" placeholder="End Date (e.g., Present)" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Image URL or Upload:</label>
                        <input className="bg-transparent border-b p-2 outline-none" placeholder="Image URL" value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} />
                        <input type="file" onChange={handleImageUpload} />
                        {formData.img && <img src={formData.img.startsWith("/static") ? `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${formData.img}` : formData.img} alt="preview" className="h-20 w-32 object-cover" />}
                    </div>
                    <textarea className="bg-transparent border p-2 outline-none h-20" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    <textarea className="bg-transparent border p-2 outline-none h-32" placeholder="Points (JSON string array, e.g., [&quot;Point 1&quot;])" value={formData.points} onChange={e => setFormData({...formData, points: e.target.value})} />
                    <div className="flex gap-4">
                        <button type="submit" className="px-4 py-2 bg-white text-black font-bold rounded cursor-none">Save</button>
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border rounded cursor-none">Cancel</button>
                    </div>
                </form>
            )}

            <div className="flex flex-col gap-4">
                {items.map(w => (
                    <div key={w.id} className="flex justify-between items-center border border-light-dark p-4 rounded hover:bg-light-dark transition-colors">
                        <div>
                            <div className="font-bold">{w.company} - {w.position}</div>
                            <div className="text-sm opacity-50">{w.start_date} to {w.end_date}</div>
                        </div>
                        <div className="flex gap-4 cursor-none">
                            <div onClick={() => handleEdit(w)} className="hover:text-blue-400">Edit</div>
                            <div onClick={() => handleDelete(w.id)} className="hover:text-red-400">Delete</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminExperiences;
