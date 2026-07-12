import React, { useState } from 'react';
import useAdminUsers from './useAdminUsers';
import PrimaryButton from '@components/ui/Buttons/PrimaryButton';

const AdminUsers = () => {
    const { users, isLoading, error, handleCreateUser, handleDeleteUser } = useAdminUsers();
    const [formData, setFormData] = useState({
        user_name: '',
        password: '',
        is_admin: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleCreateUser(formData);
        setFormData({ user_name: '', password: '', is_admin: false });
    };

    return (
        <div className="flex flex-col gap-10">
            {error && <div className="text-red-500 bg-red-500/10 p-4 rounded border border-red-500/20">{error}</div>}
            
            <div className="bg-light-dark p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-6">Add New User</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-color-text-hovering uppercase tracking-wider">Username</label>
                        <input
                            type="text"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleChange}
                            required
                            className="bg-background border border-primary/20 rounded p-3 text-primary focus:outline-none focus:border-primary transition-colors cursor-none"
                            placeholder="Enter username"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-color-text-hovering uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="bg-background border border-primary/20 rounded p-3 text-primary focus:outline-none focus:border-primary transition-colors cursor-none"
                            placeholder="Enter password"
                        />
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                        <input
                            type="checkbox"
                            name="is_admin"
                            id="is_admin"
                            checked={formData.is_admin}
                            onChange={handleChange}
                            className="w-5 h-5 accent-primary cursor-none"
                        />
                        <label htmlFor="is_admin" className="text-sm font-bold text-color-text-hovering uppercase tracking-wider cursor-none">
                            Give Admin Access?
                        </label>
                    </div>
                    
                    <div className="mt-4">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="border border-primary px-8 py-2 text-lg md:text-xl flex items-center justify-center rounded-xm cursor-none hover:text-color-text-hovering hover:border-color-text-hovering transition-colors w-full md:w-auto"
                        >
                            {isLoading ? "Adding..." : "Add User"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-light-dark p-6 rounded-lg overflow-x-auto">
                <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
                    Registered Users
                    <span className="text-sm font-normal text-color-text-hovering">Total: {users.length}</span>
                </h2>
                
                {isLoading && users.length === 0 ? (
                    <div className="text-center py-10 opacity-50">Loading users...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-primary/10">
                                <th className="p-4 text-sm font-bold text-color-text-hovering uppercase tracking-wider">ID</th>
                                <th className="p-4 text-sm font-bold text-color-text-hovering uppercase tracking-wider">Username</th>
                                <th className="p-4 text-sm font-bold text-color-text-hovering uppercase tracking-wider">Role</th>
                                <th className="p-4 text-sm font-bold text-color-text-hovering uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-primary/5 hover:bg-primary/5 transition-colors">
                                    <td className="p-4 text-color-text-hovering">#{user.id}</td>
                                    <td className="p-4 font-bold">{user.user_name}</td>
                                    <td className="p-4">
                                        {user.is_admin ? (
                                            <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full uppercase tracking-wider">Admin</span>
                                        ) : (
                                            <span className="px-3 py-1 bg-white/5 text-white/50 text-xs font-bold rounded-full uppercase tracking-wider">User</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded text-sm font-bold transition-colors cursor-none"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-color-text-hovering italic">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
