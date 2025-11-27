import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Loading from '../components/ui/Loading';
import { AnimatePresence, motion } from "framer-motion";
import { Search, ChevronRight, ChevronLeft } from 'lucide-react';

const AdminDashboard = () => {
    const { getUnverifiedUsers, unverifiedUsers, assignRole, setUnverifiedUsers } = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [roleToAssign, setRoleToAssign] = useState("student");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const USERS_PER_PAGE = 3;

    // 🔹 Cargar usuarios no verificados al montar
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await getUnverifiedUsers();
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 🔹 Filtrado por búsqueda
    const filteredUsers = unverifiedUsers.filter(u =>
        `${u.people.first_name} ${u.people.last_name} ${u.email}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // 🔹 Paginado
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );

    // 🔹 Manejo de selección
    const toggleSelectUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    // 🔹 Asignar rol a los seleccionados
    const handleAssignRole = async () => {
        if (selectedUsers.length === 0) return;
        try {
            setLoading(true);

            // Llamada al backend para asignar rol
            await assignRole({ userIds: selectedUsers, roleName: roleToAssign });

            // 🔹 Actualizar estado local eliminando los usuarios recién verificados
            setUnverifiedUsers(prev =>
                prev.filter(u => !selectedUsers.includes(u.id))
            );

            // Limpiar selección
            setSelectedUsers([]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="h-[calc(100vh-80px)] flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">
                Asignación de roles (Administrador)
            </h1>

            {loading ? (
                <>{Loading("Cargando usuarios no verificados...")}</>
            ) : (
                <div className="bg-white w-3/4 border-l-4 border-yellow-400 shadow-md h-[550px] rounded-lg p-4 flex flex-col gap-4">
                    {/* Barra de búsqueda y controles */}
                    <div className="w-full flex flex-col items-center gap-2 mb-4">
                        <div className="relative w-1/2">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar usuario..."
                                className="border border-gray-400 rounded pl-8 pr-2 py-1 w-full" // pl-8 para dejar espacio al icono
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <select
                                value={roleToAssign}
                                onChange={e => setRoleToAssign(e.target.value)}
                                className="border border-gray-400 rounded px-2 py-1"
                            >
                                <option value="student">Estudiante</option>
                                <option value="teacher">Profesor</option>
                            </select>

                            <button
                                onClick={handleAssignRole}
                                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                            >
                                Asignar rol
                            </button>
                        </div>
                    </div>

                    {/* Lista de usuarios no verificados */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            className="flex-1 overflow-y-auto"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ul className="flex flex-col gap-2 overflow-y-auto h-full">
                                {unverifiedUsers.length === 0 ? (
                                    <p className="font-bold text-center text-gray-700">
                                        No hay usuarios para verificar.
                                    </p>
                                ) : filteredUsers.length === 0 ? (
                                    <p className="font-bold text-center text-gray-700">
                                        No se encontraron resultados para "{searchTerm}".
                                    </p>
                                ) : paginatedUsers.length > 0 ? (
                                    paginatedUsers.map((user, index) => (
                                        <li key={index} className="p-4 bg-yellow-100 shadow-md rounded flex justify-between items-center">
                                            <div>
                                                <p><strong>Nombre:</strong> {user.people.first_name}</p>
                                                <p><strong>Apellido:</strong> {user.people.last_name}</p>
                                                <p><strong>DNI:</strong> {user.people.dni}</p>
                                                <p><strong>Email:</strong> {user.email}</p>
                                                <p><strong>Rol:</strong> {user.role.name === 'guest' ? 'Invitado' : user.role.name}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => toggleSelectUser(user.id)}
                                                />
                                                <span>Seleccionar</span>
                                            </div>
                                        </li>
                                    ))
                                ) : null}
                            </ul>
                        </motion.div>
                    </AnimatePresence>

                    {/* Paginado */}
                    {totalPages > 1 && (
                        <div className="flex gap-4 justify-center border-t-2 border-gray-400 pt-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-400 rounded disabled:opacity-50 disabled:border-none"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="self-center">{currentPage} de {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-400 rounded disabled:opacity-50 "
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
