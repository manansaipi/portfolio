import { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser } from '@services/adminService';

const useAdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users", err);
            setError("Failed to fetch users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (userData) => {
        setIsLoading(true);
        setError(null);
        try {
            await createUser(userData);
            await fetchUsers(); // Refresh list
        } catch (err) {
            console.error("Failed to create user", err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Failed to create user");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        setIsLoading(true);
        setError(null);
        try {
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            console.error("Failed to delete user", err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Failed to delete user");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        users,
        isLoading,
        error,
        handleCreateUser,
        handleDeleteUser
    };
};

export default useAdminUsers;
