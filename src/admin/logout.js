import React from 'react';
import { Button } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './auth';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                // Sign-out successful.
                navigate('/'); // Redirect to login page or wherever you see fit
            })
            .catch((error) => {
                // An error happened.
                console.error('Logout Error:', error);
            });
    };

    return (
        <Button floated='right' onClick={handleLogout} color='pink'>
            Logout
        </Button>
    );
};

export default LogoutButton;
