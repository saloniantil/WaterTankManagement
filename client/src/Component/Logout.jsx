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
        <div>
            <button onClick={handleLogout} className="bg-blue-400 px-4 py-2 rounded-md text-gray-100 hover:bg-opacity-80 font-semibold active:bg-blue-600">Logout</button>
        </div>
    );
};

export default Logout;
