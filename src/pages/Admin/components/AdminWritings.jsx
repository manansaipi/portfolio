import React, { useState, useEffect } from "react";
import { getWritings, deleteWriting, createWriting, updateWriting, uploadFile } from "@services/adminService";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton";

const AdminWritings = () => {
    const [writings, setWritings] = useState([]);
    const [editing, setEditing] = useState(null); // null if creating, object if editing
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [formData, setFormData] = useState({ title: "", author: "", image: "", content: "" });

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
    };

    const handleEdit = (w) => {
        setEditing(w);
        setFormData({ title: w.title, author: w.author, image: w.image, content: w.content || "" });
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditing(null);
        setFormData({ title: "", author: "", image: "", content: "" });
        setIsFormOpen(true);
    };

    const handleImageUpload = async (e) => {
        if (!e.target.files[0]) return;
        const res = await uploadFile(e.target.files[0]);
        setFormData(prev => ({ ...prev, image: res.url }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editing) {
            await updateWriting(editing.id, formData);
        } else {
            await createWriting(formData);
        }
        setIsFormOpen(false);
        fetchWritings();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold">Writings</h2>
                <PrimaryButton label="Add New" handleOnClick={handleAddNew} />
            </div>

            {isFormOpen && (
                <form onSubmit={handleSubmit} className="mb-10 p-5 border border-light-dark rounded flex flex-col gap-4">
                    <input className="bg-transparent border-b p-2 outline-none" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    <input className="bg-transparent border-b p-2 outline-none" placeholder="Author" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
                    <div className="flex flex-col gap-2">
                        <label>Image URL or Upload:</label>
                        <input className="bg-transparent border-b p-2 outline-none" placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                        <input type="file" onChange={handleImageUpload} />
                        {formData.image && <img src={formData.image.startsWith("/static") ? `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${formData.image}` : formData.image} alt="preview" className="h-20 w-32 object-cover" />}
                    </div>
                    <textarea className="bg-transparent border p-2 outline-none h-32" placeholder="Content (HTML allowed)" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                    <div className="flex gap-4">
                        <button type="submit" className="px-4 py-2 bg-white text-black font-bold rounded">Save</button>
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                    </div>
                </form>
            )}

            <div className="flex flex-col gap-4">
                {writings.map(w => (
                    <div key={w.id} className="flex justify-between items-center border border-light-dark p-4 rounded hover:bg-light-dark transition-colors">
                        <div>
                            <div className="font-bold">{w.title}</div>
                            <div className="text-sm opacity-50">By {w.author} - {new Date(w.published_at).toLocaleDateString()}</div>
                        </div>
                        <div className="flex gap-4 cursor-pointer">
                            <div onClick={() => handleEdit(w)} className="hover:text-blue-400">Edit</div>
                            <div onClick={() => handleDelete(w.id)} className="hover:text-red-400">Delete</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminWritings;
