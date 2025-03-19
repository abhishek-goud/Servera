import { useUser } from "@/context/user.context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function UserAuth({children} : {children : React.ReactNode}) {  
    const {user} = useUser();
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if(user._id === "" || user.email === "" || user.token === "" || !token) {
            navigate('/login');
        } else {
            setLoading(false);
        }
    }, [user, navigate,token]);

    if(loading){
        return <div>Loading...</div>
    }

    return ( 
        <>
            {children}
        </>
     );
}

export default UserAuth;
