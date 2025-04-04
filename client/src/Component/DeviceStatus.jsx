import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeviceStatus = () => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/devices');
                setDevices(response.data.devices);
            } catch (error) {
                console.error('Error fetching device data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Device Status</h1>
            <div className="grid grid-cols-1 gap-4">
                {devices.map(device => (
                    <div key={device.id} className="p-4 border rounded-lg bg-gray-100">
                        <h2 className="font-semibold">{device.id}</h2>
                        <p>Status: {device.status}</p>
                        <p>Water Level: {device.waterLevel}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeviceStatus;
