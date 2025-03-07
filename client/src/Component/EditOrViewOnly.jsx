import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { base_url } from "../utils/constants";

const EditOrViewOnly = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const userData = useSelector((appStore) => appStore.user);

    const checkAccess = async () => {
        try {
            const res = await axios.get(base_url + "/check-allTanks", { withCredentials: true })
            
            if (res.data.occupied) {
                setMessage(res.data.message);
                return false;
            } 
            return true;
        } catch (err) {
            setMessage(err.response.data.message)
            return false;
        }
    };

    useEffect(() => {
        
        if (!userData) {
            navigate("/");
        }

    }, [userData, navigate]);
    
    const handleViewAndEdit = async() => {
        if (!userData) return navigate("/edit-and-view-Or-View-Only");
        
        const isAvailable = await checkAccess();
        if (!isAvailable) return;
        try {
            const res = await axios.post(base_url + "/enter-allTanks", { emailId: userData.emailId }, 
            {withCredentials:true}
            )

            if (res.data.success) {
                localStorage.setItem("editAccess", "true");
                navigate("/allTanks"); 
            } else {
                setMessage(res.data.message || "Access denied.");
            }
        } catch (err) {
            setMessage(`${userData.emailId} is already in edit mode`);
        }
    }

    const handleViewOnly = () => {
        
        localStorage.setItem("editAccess", "false"); // Set view-only mode
        navigate("/allTanks");
        
    }
    return (
        <div className=" h-[100vh] w-[100vw] flex justify-center items-center">
            <div>
                <div className="buttonClickViewEdit mb-2" onClick={handleViewAndEdit}>MANUAL</div>
                {message &&
                    <div>
                        <h2>{message}</h2> 
                    </div>
                }
                <div className="font-semibold text-3xl my-8">OR</div>
                <div className="buttonClickViewEdit" onClick={handleViewOnly}>VIEW ONLY</div>
            </div>
        </div>
    )
}
export default EditOrViewOnly;