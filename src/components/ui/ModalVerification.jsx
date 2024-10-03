import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import swal from 'sweetalert';

function ModalVerification () {

    const { verifyEmail, logOut } = useAuth();

    const handleSendEmail = async () => {
        try {
            await verifyEmail();
            swal({
                title: "Enlace de verificacion enviado a tu correo",
                icon: "success",
            })
            logOut();
        } catch (error) {
            console.error('Error during email verification:', error);
        }
    }

  return (
    <>
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition duration-300 shadow-[0px_8px_5px_-5px_rgba(0,0,0,0.75)] animate-slide-in">
          <div className="flex justify-between items-center">
            <button onClick={handleSendEmail}>Se necesita verificar la cuenta</button>
          </div>
        </div>
    </>
  );
};

export default ModalVerification;
