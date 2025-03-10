import React, { useEffect, useState } from "react";
import EachTank from "./EachTank";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from 'axios';
import Popup from "./Popup";
import { base_url } from "../utils/constants";

const spreadsheetId = import.meta.env.VITE_SPREADSHEET_ID;
const apiKey = import.meta.env.VITE_API_KEY;
const tankRange = 'tank!A2:E';
const statusRange = 'status!A2:F';

const Tanks = () => {

    const navigate = useNavigate();
    const userData = useSelector((appStore) => appStore.user);

    const [tankData, setTankData] = useState([]);
    const [espStatus, setEspStatus] = useState([]);
    const [solenoidValveStatus, setSolenoidValveStatus] = useState(() =>
    tankData.map(() => "off"));
    const [espOnlineStatus, setEspOnlineStatus] = useState([false, false, false]);
    const [tankOnlineStatus, setTankOnlineStatus] = useState([false, false, false]);
    const [motorStatus, setMotorStatus] = useState("off"); // latest pump status
    const [motorWarning, setMotorWarning] = useState("");
    const [pumpWarning, setPumpWarning] = useState("");
    
    const closePopup = () => {
        setPumpWarning("");
    };
    
    useEffect(() => {
        if (!userData) {
            navigate("/");
            return;
        }
         // Redirect if user didn't enter via "VIEW AND EDIT BOTH"
         const hasAccess = localStorage.getItem("editAccess");
         if (hasAccess === null) {
             navigate("/edit-and-view-Or-View-Only");
         }
    }, [userData, navigate]);

    const fetchData = async () => {
        try {
            const tankResponse = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${tankRange}?key=${apiKey}`);
            const tankData = tankResponse.data;

            const statusResponse = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${statusRange}?key=${apiKey}&t=${Date.now()}`);
            const statusData = statusResponse.data;
            
            if (!tankData.values || !statusData.values) {
                console.error('No data found.');
                setTankOnlineStatus([false, false, false]); 
                setEspOnlineStatus([false, false, false]);
                setMotorStatus("off");
                return;
            }

             // Extract last row dynamically
            const lastRow = statusData.values[statusData.values.length - 1]; // Get latest row
            const latestPumpStatus = lastRow[5] || "off"; 
            setMotorStatus(latestPumpStatus); // Update motor status

            const { tankValues, latestTankTimestamp } = extractTankValues(tankData.values);
            console.log("Extracted Tank Values:", tankValues); 

            const { espStatus, latestEspTimeStamp } = extractStatusValues(statusData.values);

            if (lastRow) {
                const esp1 = lastRow[2]; // Column C
                const esp2 = lastRow[3]; // Column D
                const esp3 = lastRow[4]; // Column E
                
                setSolenoidValveStatus([esp1, esp2, esp3]); // Set state with ESP values
            }

            setTankData([...tankValues]);
            setEspStatus(espStatus);

            const currentTime = Date.now();

            const updatedTankOnlineStatus = latestTankTimestamp.map(timestamp => (currentTime - timestamp) <= 5000);
            const updatedEspOnlineStatus = latestEspTimeStamp.map(timestamp => {
                return !isNaN(timestamp) && (currentTime - timestamp) <= 5000;
            });

            setTankOnlineStatus(updatedTankOnlineStatus);
            setEspOnlineStatus(updatedEspOnlineStatus);

        } catch (error) {
            console.error('Error fetching data:', error);
            setTankOnlineStatus([false, false, false]);
            setEspOnlineStatus([false, false, false]);
        }
    };

    const extractTankValues = (values) => {
        let tankValues = [{ waterLevel: 0 }, { waterLevel: 0 }, { waterLevel: 0 }];
        let latestTankTimestamp = [NaN, NaN, NaN];
        let latestRowIndex = [-1, -1, -1]; // Track the latest row index for each tank
    
        if (!values.length) return { tankValues, latestTankTimestamp };
    
        for (let row = values.length - 1; row >= 0; row--) {
            const [lastDate, lastTime, tank1, tank2, tank3] = values[row];
    
            if (!lastDate || !lastTime) continue;
    
            const dateParts = lastDate.split("/");
            if (dateParts.length === 3) {
                const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                const baseTimestamp = new Date(`${formattedDate}T${lastTime}`).getTime();
    
                if (!isNaN(baseTimestamp)) {
                    if (tank1 !== undefined && tank1 !== '' && latestRowIndex[0] === -1) {
                        latestTankTimestamp[0] = baseTimestamp;
                        tankValues[0] = { waterLevel: parseFloat(tank1) || 0 };
                        latestRowIndex[0] = row;
                    }
                    if (tank2 !== undefined && tank2 !== '' && latestRowIndex[1] === -1) {
                        latestTankTimestamp[1] = baseTimestamp;
                        tankValues[1] = { waterLevel: parseFloat(tank2) || 0 };
                        latestRowIndex[1] = row;
                    }
                    if (tank3 !== undefined && tank3 !== '' && latestRowIndex[2] === -1) {
                        latestTankTimestamp[2] = baseTimestamp;
                        tankValues[2] = { waterLevel: parseFloat(tank3) || 0 };
                        latestRowIndex[2] = row;
                    }
                }
            }
            // Stop early if all tanks have been updated
            if (latestRowIndex[0] !== -1 && latestRowIndex[1] !== -1 && latestRowIndex[2] !== -1) {
                break;
            }
        }
    
        return { tankValues, latestTankTimestamp };
    };

    
    const extractStatusValues = (values) => {
        let latestEspTimeStamp = [NaN, NaN, NaN];

        if (!values.length) {
            return { espStatus: ["unknown", "unknown", "unknown"], pumpStatus: "unknown", latestEspTimeStamp };
        }

        let lastValidRow = values.length - 1;

        while (lastValidRow >= 0) {
            if (values[lastValidRow][0] && values[lastValidRow][1]) break;
            lastValidRow--;
        }

        if (lastValidRow < 0) {
            return { espStatus: ["unknown", "unknown", "unknown"], pumpStatus: "unknown", latestEspTimeStamp };
        }

        const lastRow = values[lastValidRow];
        const [lastDate, lastTime, esp1, esp2, esp3, pump] = lastRow;
        
        let fullTimestamp = NaN; 
        const dateParts = lastDate.split("/");

        if (dateParts.length === 3) {
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            fullTimestamp = new Date(`${formattedDate}T${lastTime}`).getTime();
        }
        

        [esp1, esp2, esp3].forEach((status, index) => {
            if (status !== undefined && status !== "") {
                latestEspTimeStamp[index] = fullTimestamp;
            }
        });

        // const normalizedPumpStatus = pump?.toLowerCase().trim() === "on" 
        // ? ["on", "on", "on"] 
        // : ["off", "off", "off"];

        return { 
            espStatus: [
                esp1?.toLowerCase() === "on" ? "on" : "off",
                esp2?.toLowerCase() === "on" ? "on" : "off",
                esp3?.toLowerCase() === "on" ? "on" : "off"
            ], 
            // pumpStatus: normalizedPumpStatus,
            latestEspTimeStamp 
        };
    };

    // const getWaterLevelPercent = (sensorValue) => {
    //     if (typeof sensorValue !== "number" || isNaN(sensorValue)) return 0;
    //     return Math.round(((58 - sensorValue) / 40) * 100);
    // };

    const getWaterLevelPercent = (sensorValue) => {
        if (typeof sensorValue !== "number" || isNaN(sensorValue)) return 0;
    
        const minSensorValue = 18;  // Value when tank is FULL
        const maxSensorValue = 58;  // Value when tank is EMPTY
        const range = maxSensorValue - minSensorValue;
    
        let percentage = ((maxSensorValue - sensorValue) / range) * 100;
    
        // Ensure percentage is within valid range
        return Math.max(0, Math.min(100, Math.round(percentage)));
    };
    

    const handleToggle = async (tankNumber) => {
        
        if (localStorage.getItem("editAccess") === "false") return;

        try {
            const newStatus = solenoidValveStatus[tankNumber - 1] === "on" ? "off" : "on";

            // Count how many solenoid valves are currently off
            const offValves = solenoidValveStatus.filter(status => status === "off").length;
            
            // Prevent turning off the last solenoid valve while motor is on
            if (newStatus === "off" && offValves === 2 && motorStatus === "on") {
                setPumpWarning("⚠️ Cannot turn off the last valve while the motor is ON. Please turn off the motor first.");
                return;
            }

            setPumpWarning(""); 
            
            const lastRowResponse = await axios.get(base_url + "/get-last-row");
            const lastRow = lastRowResponse.data.lastRow;
            
            const columnLetter = String.fromCharCode(67 + tankNumber - 1); 
            const range = `status!${columnLetter}${lastRow}`; // Use dynamic row number
            

            const requestData = {
                range,
                values: [[newStatus]],
            };
            
            const response = await axios.post(base_url + "/update-tank-status", requestData);
            
            if (response.data.success) {

                setSolenoidValveStatus(prevStatus => {
                    const updatedStatuses = [...prevStatus];
                    updatedStatuses[tankNumber - 1] = newStatus;
                    return updatedStatuses;
                });
    
                setTimeout(() => {
                    fetchData();
                }, 3000);
            } else {
                console.error("Failed to update Google Sheets:", response.data.message);
            }
    
        } catch (error) {
            console.error("Error updating in Google Sheets:", error.response ? error.response.data : error.message);
        }

    };

    const handleMotorToggle = async () => {
        
        if (localStorage.getItem("editAccess") === "false") return;

        try {

            if (motorStatus === "off" && solenoidValveStatus.every(status => status === "off")) {
                setMotorWarning("⚠️Connot turn on the motor since all valves are off!");
                return;
            }

            setMotorWarning(""); // Clear warning jese hi condition met

            const newMotorStatus = motorStatus === "on" ? "off" : "on";

            const lastRowResponse = await axios.get(base_url +  "/get-last-row");
            const lastRow = lastRowResponse.data.lastRow;
            
            const motorColumn = "F";
            const range = `status!${motorColumn}${lastRow}`

            const requestData = {
                range,
                values: [[newMotorStatus]]
            }

            const response = await axios.post(base_url + "/update-tank-status", requestData);

            if (response.data.success) {
                setMotorStatus(newMotorStatus);

                setTimeout(() => {
                    fetchData();
                }, 10000);
            } else {
                console.error("Failed to update Google Sheets:", response.data.message);
            }
        } catch {
            console.error("Error updating Motor status in Google Sheets:", error.response ? error.response.data : error.message);
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData();
        }, 5000);
        return () => clearInterval(intervalId);
    }, [solenoidValveStatus], [tankData]);

    return (
        <div>
            <div className="flex justify-center items-center mt-8 "><img className="h-36" src="/logoPIET.jpg" alt="LOGO " /></div>
            <h1 className="piet-heading md:text-5xl text-2xl mt-2">
                Panipat Institute of Engineering and Technology
            </h1>
            <h2 className="title md:text-5xl text-xl mb-10">Water Tank Monitoring & Control System</h2>
            <Logout />
            <Popup message={pumpWarning} onClose={closePopup} />
            <div className="flex flex-wrap justify-center items-center lg:space-x-4 lg:space-y-0 space-y-10">
                {tankData.map((tank, index) => (
                    <EachTank key={index}
                        tankNumber={index + 1}
                        waterLevel={getWaterLevelPercent(tank.waterLevel)}
                        solenoidValveStatus={solenoidValveStatus[index] || "off"}
                        isNodeMcuOnline={tankOnlineStatus[index]}
                        isEsp32Online={espOnlineStatus[index] ?? false}
                        onToggle= {() => handleToggle(index + 1)}
                    />
                ))}
            </div>

            <div className="motor-status-box">
                <div className="motor-status">
                    <p>Motor Status: <span style={{color:motorStatus === "on" ? "rgb(15, 154, 15)" : "rgb(219, 30, 30)"}}>{motorStatus.toUpperCase()}</span></p>
                </div>
                {(localStorage.getItem("editAccess") === "false") ?
                    null
                    :
                    <button
                        className={`motor-status onactive`}
                        style={{backgroundColor:motorStatus === "on" ? "rgb(219, 30, 30)" : "rgb(15, 154, 15)"}}
                        onClick={handleMotorToggle}
                    >
                        {motorStatus === "on" ? "Turn OFF" : "Turn ON"}
                    </button>}
                {motorWarning && (
                    <p className="text-red-600 font-semibold mt-2 border border-gray-400 rounded-md py-1 px-3 bg-white">{motorWarning}</p>
                )}
            </div>

            <div className="my-10">
                <p>MADE BY TEAM AGRI-TECHIES</p>
                <p>DESIGNED BY PRIYANSHU SHARMA</p>
            </div>
        </div>
    );
};

export default Tanks;
