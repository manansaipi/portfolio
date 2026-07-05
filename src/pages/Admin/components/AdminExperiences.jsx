import React from "react";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton";
import { resolveImg } from "@utils/imageUtils";
import { useAdminExperiences } from "./useAdminExperiences";

const AdminExperiences = () => {
    const {
        items,
        isFormOpen,
        setIsFormOpen,
        formData,
        setFormData,
        handleDelete,
        handleEdit,
        handleAddNew,
        handleImageUpload,
        handleSubmit
    } = useAdminExperiences();

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
                        {formData.img && <img src={resolveImg(formData.img)} alt="preview" className="h-20 w-32 object-cover" />}
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
