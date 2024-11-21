import React, { useState, useEffect } from 'react';
import { useClass } from '../context/ClassContext';
import { useParams } from 'react-router-dom';
import { Riple } from 'react-loading-indicators';

function People() {
    const { classId } = useParams();
    const [usersByRole, setUsersByRole] = useState({});
    const { getUsersByClass } = useClass();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getUsersByClass(classId);

                // Agrupar usuarios por roles
                const groupedUsers = fetchedUsers.reduce((acc, user) => {
                    if (user.roles_fk === 2) {
                        acc['ALUMNO(S)'] = acc['ALUMNO(S)'] || [];
                        acc['ALUMNO(S)'].push(user);
                    } else if (user.roles_fk === 3) {
                        acc['DOCENTE(S)'] = acc['DOCENTE(S)'] || [];
                        acc['DOCENTE(S)'].push(user);
                    }
                    return acc;
                }, {});

                // Establecer los usuarios agrupados por roles
                setUsersByRole(groupedUsers);
                setIsLoading(false);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };
        fetchUsers();
    }, [classId, getUsersByClass]);

    return (
        <div className='mx-5 md:mx-0'>
            <h2 className="dark:text-white text-2xl font-bold mb-4">Integrantes de la clase</h2>
            {isLoading ? (
                <div className="flex justify-center">
                    <Riple color="#cec702" size="large" />
                </div>
            ) : (
                <>
                    {Object.keys(usersByRole).length === 0 ? (
                        <p className="dark:text-white">No hay usuarios en esta clase.</p>
                    ) : (
                        // Mostrar roles en el orden: PROFESORES primero, luego ESTUDIANTES
                        ['DOCENTE(S)', 'ALUMNO(S)'].map((role) =>
                            usersByRole[role] ? (
                                <div key={role} className='border border-gray-300 shadow-lg p-2 m-2 rounded-lg'>
                                    <h1 className="text-2xl font-bold dark:text-white mb-2">{role}:</h1>
                                    <ul className="space-y-2">
                                        {usersByRole[role].map((user, index) => (
                                            <li key={index} className="dark:text-white text-lg">
                                                {user.people.first_name} {user.people.last_name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null
                        )
                    )}
                </>
            )}
        </div>
    );
}

export default People;
