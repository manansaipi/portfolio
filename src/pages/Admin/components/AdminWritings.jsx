import React from "react";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { resolveImg } from "@utils/imageUtils";
import { useAdminWritings } from "./useAdminWritings";

const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
    ],
};

const AdminWritings = () => {
    const {
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
    } = useAdminWritings();

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
                        {formData.image && <img src={resolveImg(formData.image)} alt="preview" className="h-20 w-32 object-cover" />}
                    </div>
                    
                    <div className="admin-quill-editor">
                        <label className="mb-2 block">Content:</label>
                        <ReactQuill
                            theme="snow"
                            value={formData.content}
                            onChange={(value) => setFormData({...formData, content: value})}
                            modules={quillModules}
                            className="bg-white text-black rounded"
                            style={{ minHeight: "200px" }}
                        />
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button type="submit" className="px-4 py-2 bg-white text-black font-bold rounded cursor-none">Save</button>
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border rounded cursor-none">Cancel</button>
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

export default AdminWritings;
