import React, { useState, useEffect } from 'react';
import { useClass } from '../context/ClassContext';
import { useParams } from 'react-router-dom';
import { Riple } from 'react-loading-indicators';
import { use } from 'framer-motion/client';

function People() {
    const { classId } = useParams();
    const [users, setUsers] = useState([]);
    const { getUsersByClass } = useClass();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getUsersByClass(classId);
                setUsers(fetchedUsers);
                setIsLoading(false);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };
        fetchUsers();
    }, [classId, getUsersByClass]);


    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Integrantes de la clase</h2>
            {isLoading ? (
                <div className='flex justify-center'>
                    <Riple color="#cec702" size="large" />
                </div>
            ) : (
                <>
                    {users.length === 0 ? (
                        <p>No hay usuarios en esta clase.</p>
                    ) : (
                        <ul className="space-y-2">
                            {users.map((user, index) => {

                                const { Person } = user;

                                if (Person) {

                                    return (

                                        <li key={index} className="p-3 border border-gray-300 rounded-lg">
                                            {Person.first_name} {Person.last_name}
                                        </li>
                                    );
                                }
                                return null; // Si no tiene "Person", no renderizar nada
                            })}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}

export default People;
