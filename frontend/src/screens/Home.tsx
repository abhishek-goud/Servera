import { useUser } from "@/context/user.context";
function Home() {
    const {user} = useUser();
    return ( 
        <div>
            Welcome {user.email || "<no user>"} to home
        </div>
     );
}

export default Home;