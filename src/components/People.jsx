import React, { useState, useEffect } from 'react';
import { useClass } from '../context/ClassContext';
import { useParams } from 'react-router-dom';
import { Riple } from 'react-loading-indicators';
import { set } from 'react-hook-form';
import HighlightLetter from './ui/HighlightLetter';

function People() {
    const { classId } = useParams();
    const { getUsersByClass } = useClass();
    const [isLoading, setIsLoading] = useState(true);
    const [people, setPeople] = useState();

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const users = await getUsersByClass(classId);
                setPeople(users);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [classId, getUsersByClass]);

    console.log('people', people)

    return (
        <div className='mx-5 md:mx-0'>
            {isLoading ? (
                <div className="flex justify-center">
                    <Riple color="#cec702" size="large" />
                </div>
            ) : (
                <>
                    {people?.length === 0 ? (
                        <p className="dark:text-white">No hay usuarios en esta clase.</p>
                    ) : (
                        <ul className='bg-white rounded-lg p-5 shadow-md'>
                            {people?.map((person) => (
                                <>
                                    {person.role.name === 'teacher' ? (
                                        <>
                                            <HighlightLetter className="font-opendyslexic font-semibold" size='text-lg'>Docente/s:</HighlightLetter>
                                            <li key={person.id} className="mb-4 p-4 rounded-lg shadow-sm bg-pastelYellow">
                                                <p className="dark:text-white font-semibold">{person.people.first_name} {person.people.last_name}</p>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <HighlightLetter className="font-opendyslexic font-semibold" size='text-lg'>Estudiantes:</HighlightLetter>
                                            <li key={person.id} className="mb-4 p-4 rounded-lg shadow-sm bg-pastelYellow">
                                                <p className="dark:text-white font-semibold">{person.people.first_name} {person.people.last_name}</p>
                                            </li>
                                        </>
                                    )}
                                </>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}

export default People;
