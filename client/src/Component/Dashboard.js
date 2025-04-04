import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [waterLevel, setWaterLevel] = useState(null);
    const [motorStatus, setMotorStatus] = useState(null);
    const [deviceStatus, setDeviceStatus] = useState('');
    const waterLevelURL = '<YOUR_WATER_LEVEL_URL>'; // Replace with your actual URL
    const motorStatusURL = '<YOUR_MOTOR_STATUS_URL>'; // Replace with your actual URL
    const deviceStatusURL = '<https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjCTkpC9HzapS6pKzPLo_5DM_DUZBiY9ZIv0q0pjkNcIGn24fYvORrqn15D8SjYZJMBWzBojTkNtkc0_UdNZ1BKn5DzUawCoqImvVXSzPyvm65sJfADmDeo3DLAQUxJ4GimpYCvPBK12c1VXC23nb8UzGjfx7lkM8hOXo0Rx0ObBYT97gusufaFNge4epCkNP1P_HUTEacY7NiaKE2duM57CATP7YkNQVnnJtYiNT1LSfPSUwHGY-nPxzVMsjoYMs1qlRx4e1q12FkAZ_mxovVIcuX1Yf4twuz_96r-&lib=M016iV9ZAX_zzUoMtNy2AmN4yI5Fx_Z2R>'; // Replace with your actual URL

    useEffect(() => {
        const fetchWaterLevel = async () => {
            try {
                const response = await axios.get(waterLevelURL);
                setWaterLevel(response.data); // Assuming response is just the water level
            } catch (error) {
                console.error('Error fetching water level:', error);
            }
        };

        const fetchMotorStatus = async () => {
            try {
                const response = await axios.get(motorStatusURL);
                setMotorStatus(response.data); // Assuming response is just the motor status
            } catch (error) {
                console.error('Error fetching motor status:', error);
            }
        };

        const fetchDeviceStatus = async () => {
            try {
                const response = await axios.get(deviceStatusURL);
                const status = response.data.trim();
                setDeviceStatus(status === 'Online' ? 'Online' : 'Offline');
            } catch (error) {
                console.error('Error fetching device status:', error);
                setDeviceStatus('Offline');
            }
        };

        fetchWaterLevel();
        fetchMotorStatus();
        fetchDeviceStatus();

        const intervalId = setInterval(() => {
            fetchWaterLevel();
            fetchMotorStatus();
            fetchDeviceStatus();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            <div className="mb-4">
                <p><strong>Device Status:</strong> {deviceStatus === 'Online' ? <span className="text-green-500">Online</span> : <span className="text-red-500">Offline</span>}</p>
            </div>

            <div className="mb-4">
                <p><strong>Water Level:</strong> {waterLevel !== null ? `${waterLevel}` : 'Loading...'}</p>
            </div>

            <div className="mb-4">
                <p><strong>Motor Status:</strong> {motorStatus !== null ? `${motorStatus}` : 'Loading...'}</p>
            </div>
        </div>
    );
};

export default Dashboard;
