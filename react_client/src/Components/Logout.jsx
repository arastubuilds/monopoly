import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

const Logout = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const userLogout = async () => {
        await logout();
        navigate("/");
    }
    return (
        <>
            {userLogout()}
        </>
    )
}
export default Logout;