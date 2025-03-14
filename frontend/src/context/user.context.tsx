import {createContext, useState, useContext} from 'react';

interface User{ 
    email: string;
    token: string;
    _id: string;
}

const UserContext = createContext<{ user: User ; setUser: React.Dispatch<React.SetStateAction<User>> }>({
    user: {email: "", token: "", _id: ""},
    setUser: () => {}
});

interface UserProviderProps {
    children: React.ReactNode;
}

export const UserProvider = ({children}: UserProviderProps) => {
    const [user, setUser] = useState<User>({email: "", token: "", _id: ""});

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );

}


// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
    return useContext(UserContext);
}