import { useEffect, useState } from "react";
import {useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { base_url } from "../utils/constants";
import Logout from "./Logout";

const EditOrViewOnly = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [automate, setAutomate] = useState(false);
    const userData = useSelector((appStore) => appStore.user);
    const freeBrowse = useSelector((state) => state.freeTrial.free);
    
    useEffect(() => {
        
        if (!userData) {
            navigate("/");
        } else {
            startAutomation();
            const interval = setInterval(checkAutomationStatus, 3000);
            return () => clearInterval(interval);
        }

    }, [userData, navigate]);

    const startAutomation = async() => {
        try {
            await axios.post(base_url + "/automate/start", {}, {
                withCredentials: true
            });
            setAutomate("ON");
            console.log("automation is running!")
        } catch(error) {
            setMessage("Failed to start automation!")
            console.error(error.message);
        }
    }

    const checkAutomationStatus = async () => {
        try {
            const response = await axios.get(base_url + "/automate/status", {
                withCredentials: true
            });
            setAutomate(response.data.data.isMonitoringActive ? "ON" : "OFF");
        } catch (error) {
            setAutomate("OFF");
            console.error(error.message);
        }
    };

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
    
    const handleViewAndEdit = async() => {
        if (!userData) return navigate("/edit-and-view-Or-View-Only");
        
        try {
            await axios.post(base_url + "/automate/stop", {}, {
                withCredentials: true
            });
            setAutomate("OFF");
            console.log("Automation turned off!")
        } catch(error) {
            setMessage("Failed to stop automation!");
            console.error(error.message);
            return;
        }

        const isAvailable = await checkAccess();
        if (!isAvailable) return;
        try {
            if (!userData) return navigate("/edit-and-view-Or-View-Only");


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
            console.error(err.messge);
        }
    }

    const handleViewOnly = () => {
        
        localStorage.setItem("editAccess", "false"); // Set view-only mode
        navigate("/allTanks");
        
    }

    const handleProClick = () => {
        navigate("/subscription");
    }

    const AutomationStatusIndicator = () => (
        <div className="automation-status md:text-3xl text-lg">
            <div className={`status-dot ${automate === "ON" ? "active" : ""}`}></div>
            <span>System Running In Automation Mode</span>
        </div>
    );
    return (
        <div className=" h-[100vh] w-[100vw] flex flex-col items-end">
            <div className=" m-10 absolute flex" onClick={handleProClick}>
                
                <div className="border border-amber-500 shadow-sm shadow-amber-400 px-3 py-2 rounded-md cursor-pointer  font-semibold text-sm active:bg-blue-400 active:text-white active:shadow-none mr-4">Try Pro</div>

                <Logout />
            </div>
            
            <div className="h-full w-full flex flex-col justify-center items-center">
                
                {freeBrowse ? null : <AutomationStatusIndicator />}
                
                {freeBrowse ? null : <div className="buttonClickViewEdit mb-2" onClick={handleViewAndEdit}>MANUAL</div>}
                
                {message && !freeBrowse && 
                    <div>
                        <h2>{message}</h2> 
                    </div>
                }

                {!freeBrowse && <div className="font-semibold text-3xl my-8">OR</div>}

                <div className="buttonClickViewEdit" onClick={handleViewOnly}>VIEW ONLY</div>
                
            </div>
        </div>
    )
}
export default EditOrViewOnly;