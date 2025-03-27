import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../utils/Slices/userSlice";
import axios from 'axios';
import { base_url } from "../utils/constants";
import { useState } from "react";
const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [, setAutomate] = useState(false);
    const handleLogout = async() => {
        try {
            await axios.post(base_url +  "/logout",
                {},
                { withCredentials: true }
            );
            await axios.post(base_url + '/automate/stop', {},
                {
                    withCredentials: true
                }
            );
            setAutomate('OFF');
            dispatch(removeUser());
            navigate("/");
            console.log("Automation turned off!");
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
