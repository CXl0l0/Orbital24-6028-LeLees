//Reference from https://www.youtube.com/watch?v=Vv_Oi7zPPTw

import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'

const AuthDetails = () => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });

        return () => {
            listen();
        }

    }, []);

  return (
    
  )
}

export default AuthDetails