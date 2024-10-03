import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function ModalVerification () {

    const { verifyEmail } = useAuth();

    const handleSendEmail = async () => {
        try {
            await verifyEmail();
        } catch (error) {
            console.error('Error during email verification:', error);
        }
    }

  return (
    <>
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
          <div className="flex justify-between items-center">
            <button onClick={handleSendEmail}>Se necesita verificar la cuenta</button>
          </div>
        </div>
    </>
  );
};

export default ModalVerification;
