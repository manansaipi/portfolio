import React, { useRef, useMemo } from "react";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { resolveImg } from "@utils/imageUtils";
import { useAdminWritings } from "./useAdminWritings";
import { uploadFile } from "@services/adminService";

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
        handleMultipleImageUpload,
        removeMultipleImage,
        addMultipleImageUrl,
        handleSubmit
    } = useAdminWritings();

    const quillRef = useRef(null);

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                try {
                    const res = await uploadFile(file);
                    const url = resolveImg(res.url);
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', url);
                    quill.setSelection(range.index + 1);
                } catch (error) {
                    console.error("Error uploading image:", error);
                    alert("Failed to upload image");
                }
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['blockquote', 'code-block'],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), []);

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
                    <input type="number" className="bg-transparent border-b p-2 outline-none" placeholder="Order (e.g. 1, 2, 3)" value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} />
                    
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Main Image (Thumbnail):</label>
                        <input className="bg-transparent border-b p-2 outline-none" placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                        <input type="file" onChange={handleImageUpload} />
                        {formData.image && <img src={resolveImg(formData.image)} alt="preview" className="h-20 w-32 object-cover" />}
                    </div>

                    <div className="flex flex-col gap-2 border-t pt-4 border-light-dark">
                        <label className="font-bold">Carousel Images (Detail Page):</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.images && formData.images.map((img, i) => (
                                <div key={i} className="relative group">
                                    <img src={resolveImg(img)} alt="carousel" className="h-20 w-32 object-cover rounded" />
                                    <div onClick={() => removeMultipleImage(i)} className="absolute inset-0 bg-black/50 text-white flex justify-center items-center opacity-0 group-hover:opacity-100 cursor-pointer rounded transition-opacity">Remove</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input type="file" onChange={handleMultipleImageUpload} className="flex-1" />
                            <button type="button" onClick={() => {
                                const url = window.prompt("Enter Image URL:");
                                addMultipleImageUrl(url);
                            }} className="px-2 py-1 border rounded hover:bg-light-dark">Add URL</button>
                        </div>
                    </div>
                    
                    <div className="admin-quill-editor">
                        <label className="mb-2 block">Content:</label>
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={formData.content}
                            onChange={(value) => setFormData({...formData, content: value})}
                            modules={modules}
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
