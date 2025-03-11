import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../utils/Slices/userSlice";
import axios from 'axios';
import { base_url } from "../utils/constants";
const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = async() => {
        try {
            const res = await axios.post(base_url +  "/logout",
                {},
                { withCredentials: true }
            );
            dispatch(removeUser());
            navigate("/");
        }catch(err){
            console.error(err);
        }
    };

    return (
        <div className="mb-10">
            <button onClick={handleLogout} className="bg-blue-400 px-4 py-2 rounded-md text-gray-100 hover:bg-opacity-80 font-semibold shadow-md shadow-blue-400 active:shadow-none">Logout</button>
        </div>
    );
};

export default Logout;
