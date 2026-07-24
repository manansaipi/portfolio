import React, { useRef, useMemo } from "react";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { resolveImg } from "@utils/imageUtils";
import { useAdminWritings } from "./useAdminWritings";
import { uploadFile } from "@services/admin";

const AdminWritings = () => {
    const {
        writings,
        editing,
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
                <form key={editing ? editing.id : 'new'} onSubmit={handleSubmit} className="mb-10 p-6 border border-light-dark rounded-xl flex flex-col gap-6 bg-background/50">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm opacity-70">Title</label>
                            <input className="bg-background border border-light-dark p-3 rounded-md outline-none focus:border-primary transition-colors" placeholder="Enter writing title..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <label className="text-sm opacity-70">Author</label>
                            <input className="bg-background border border-light-dark p-3 rounded-md outline-none focus:border-primary transition-colors" placeholder="Author name..." value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-sm opacity-70">Order / Priority</label>
                        <input type="number" className="bg-background border border-light-dark p-3 rounded-md outline-none focus:border-primary transition-colors w-full md:w-1/3" placeholder="Order (e.g. 1, 2, 3)" value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} />
                    </div>
                    
                    <div className="flex flex-col gap-3 p-4 border border-light-dark rounded-md bg-background">
                        <label className="font-bold border-b border-light-dark pb-2">Main Image (Thumbnail):</label>
                        <div className="flex items-center gap-4">
                            <input type="file" onChange={handleImageUpload} className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-light-dark file:text-primary hover:file:bg-opacity-80 cursor-none" />
                        </div>
                        <input className="bg-background border border-light-dark p-3 rounded-md outline-none focus:border-primary transition-colors" placeholder="Or enter Image URL manually..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                        {formData.image && (
                            <div className="relative group w-max mt-2">
                                <img src={resolveImg(formData.image)} alt="preview" className="h-32 w-48 object-cover rounded-md border border-light-dark" />
                                <div 
                                    onClick={() => setFormData({...formData, image: ''})} 
                                    className="absolute inset-0 bg-black/70 text-white flex justify-center items-center opacity-0 group-hover:opacity-100 cursor-none rounded-md transition-opacity"
                                >
                                    Remove
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 p-4 border border-light-dark rounded-md bg-background">
                        <label className="font-bold border-b border-light-dark pb-2">Carousel Images (Detail Page):</label>
                        <div className="flex flex-wrap gap-3 mb-2">
                            {formData.images && formData.images.map((img, i) => (
                                <div key={i} className="relative group">
                                    <img src={resolveImg(img)} alt="carousel" className="h-24 w-36 object-cover rounded-md border border-light-dark" />
                                    <div 
                                        onClick={() => removeMultipleImage(i)} 
                                        className="absolute inset-0 bg-black/70 text-white flex justify-center items-center opacity-0 group-hover:opacity-100 cursor-none rounded-md transition-opacity"
                                    >
                                        Remove
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4 items-center">
                            <input type="file" onChange={handleMultipleImageUpload} className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-light-dark file:text-primary hover:file:bg-opacity-80 cursor-none" />
                            <div className="h-6 w-px bg-light-dark"></div>
                            <button type="button" onClick={() => {
                                const url = window.prompt("Enter Image URL:");
                                if (url) addMultipleImageUrl(url);
                            }} className="px-4 py-2 text-sm border border-light-dark rounded-md hover:bg-light-dark transition-colors cursor-none shrink-0">
                                Add Image from URL
                            </button>
                        </div>
                    </div>
                    
                    <div className="admin-quill-editor flex flex-col gap-1">
                        <label className="text-sm opacity-70">Content:</label>
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={formData.content}
                            onChange={(value) => setFormData({...formData, content: value})}
                            modules={modules}
                            className="rounded-md"
                            style={{ minHeight: "300px" }}
                        />
                    </div>

                    <div className="flex gap-4 mt-6 pt-4 border-t border-light-dark">
                        <button type="submit" className="px-6 py-2 bg-primary text-background font-bold rounded-md hover:opacity-90 transition-opacity cursor-none">Save Changes</button>
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2 border border-light-dark rounded-md hover:bg-light-dark transition-colors cursor-none">Cancel</button>
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
