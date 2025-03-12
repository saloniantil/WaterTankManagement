import { useNavigate } from "react-router-dom";
import { base_url } from "../utils/constants";
import axios from "axios";
import { useSelector } from "react-redux";

const ExitTanks = () => {
    const navigate = useNavigate();
    const userData = useSelector((state) => state.user);  
    
    const handleExitMode = async () => {
        const editAccess = localStorage.getItem("editAccess");
        if (editAccess === "false") {
            // If in view-only mode, just navigate away (no need to call API)
            navigate("/edit-and-view-Or-View-Only");
            return;
        }
        try {
            const res = await axios.post(base_url + "/exit-allTanks", 
                {emailId: userData.emailId},
                { withCredentials: true }
            )
            if (res.data.success) {
                localStorage.removeItem("editAccess");
                navigate("/edit-and-view-Or-View-Only");
            } else {
                setMessage(res.data.message || "Error exiting manual mode.");
            }
        } catch (err) {
            console.error(err.message);
        }
        
    }
    return (
        <>
            <div className="mb-10">
                <button className="exit_button"
                onClick={handleExitMode}
                >
                    Exit Mode
                </button>
            </div>
        </>
    )
}
export default ExitTanks;