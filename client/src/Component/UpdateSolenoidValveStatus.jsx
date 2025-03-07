const updateSolenoidValveStatus = async (tankNumber, newStatus) => {
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${statusRange}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: [[newStatus]]
            }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating status:', error);
    }
};
export default updateSolenoidValveStatus;