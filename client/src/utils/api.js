import axios from 'axios';

const statusUrl = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjCTkpC9HzapS6pKzPLo_5DM_DUZBiY9ZIv0q0pjkNcIGn24fYvORrqn15D8SjYZJMBWzBojTkNtkc0_UdNZ1BKn5DzUawCoqImvVXSzPyvm65sJfADmDeo3DLAQUxJ4GimpYCvPBK12c1VXC23nb8UzGjfx7lkM8hOXo0Rx0ObBYT97gusufaFNge4epCkNP1P_HUTEacY7NiaKE2duM57CATP7YkNQVnnJtYiNT1LSfPSUwHGY-nPxzVMsjoYMs1qlRx4e1q12FkAZ_mxovVIcuX1Yf4twuz_96r-&lib=M016iV9ZAX_zzUoMtNy2AmN4yI5Fx_Z2R"; // Replace this with your actual deployed URL

export const fetchDeviceStatus = async () => {
    try {
        const response = await axios.get(statusUrl);
        const statusData = response.data;

        if (!statusData) {
            console.error('No status data found.');
            return {};
        }
        
        console.log("Fetched Status Data:", statusData);
        return statusData;
    } catch (error) {
        console.error('Error fetching device status:', error);
        return {};
    }
};
