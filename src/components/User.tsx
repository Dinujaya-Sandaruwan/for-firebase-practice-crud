import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

interface User {
    displayName: string;
    photoURL: string;
    uid: string;
}

const App = () => {
    const [user, setUser] = useState<User | null>(null);

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const { user } = result;
            if (user) {
                setUser({
                    displayName: user.displayName || '',
                    photoURL: user.photoURL || '',
                    uid: user.uid, // Assign the user's UID
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // Log the user's UID when the component mounts or when the user changes
        if (user) {
            console.log('User UID:', user.uid);
        }
    }, [user]);

    return (
        <div>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
            {user?.uid == 'iLABCrRRT8ZuKRHjfj66lsB9AO73' || (
                <div>
                    {user?.photoURL && (
                        <img
                            src={user?.photoURL}
                            referrerPolicy="no-referrer"
                            alt={user?.displayName}
                        />
                    )}
                    <h1>{user?.displayName}</h1>
                </div>
            )}
        </div>
    );
};

export default App;
