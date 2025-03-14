
export const createTankController = (sheetService) => {
    const state = {
      pumpStatus: "off",
      valveStatus: { 1: "off", 2: "off", 3: "off" },
      previousLevels: { 1: 30.0, 2: 30.0, 3: 30.0 },
      monitoringInterval: null
    };
  
    // const controlPump = (action) => {
    //   if (action === 'on' && state.pumpStatus === 'off') {
    //     console.log('Turning pump ON');
    //     state.pumpStatus = 'on';
    //     return true;
    //   }
    //   if (action === 'off' && state.pumpStatus === 'on') {
    //     console.log('Turning pump OFF');
    //     state.pumpStatus = 'off';
    //     return true;
    //   }
    //   return false;
    // };
  
    // const logStatus = async () => {
    //   const currentTime = new Date();
    //   const statusRow = [
    //     currentTime.toISOString().split('T')[0],
    //     currentTime.toTimeString().split(' ')[0],
    //     state.valveStatus[1],
    //     state.valveStatus[2],
    //     state.valveStatus[3],
    //     state.pumpStatus
    //   ];
      
    //   try {
    //     await sheetService.appendStatus(statusRow);
    //   } catch (error) {
    //     console.error('Error logging status:', error);
    //   }
    // };
  
    // const checkLevels = async () => {
    //   try {
    //     const ranges = ['Sheet1!C2:C', 'Sheet1!D2:D', 'Sheet1!E2:E'];
    //     const responses = await Promise.all(ranges.map(range => 
    //       sheetService.getSheetData(range)
    //     ));
  
    //     // ... rest of your tank monitoring logic ...
    //     // Use state object and logStatus function
  
    //   } catch (error) {
    //     console.error('Tank monitoring error:', error);
    //   }
    // };
  
    // return {
    //   startMonitoring: () => {
    //     if (!state.monitoringInterval) {
    //       state.monitoringInterval = setInterval(checkLevels, 3000);
    //     }
    //   },
      
    //   stopMonitoring: () => {
    //     if (state.monitoringInterval) {
    //       clearInterval(state.monitoringInterval);
    //       state.monitoringInterval = null;
    //     }
    //   },
      
    //   getState: () => ({ ...state }),
      
    //   handleStartMonitoring: async (req, res) => {
    //     this.startMonitoring();
    //     res.status(200).json({ message: 'Monitoring started' });
    //   },
      
    //   handleStopMonitoring: async (req, res) => {
    //     this.stopMonitoring();
    //     res.status(200).json({ message: 'Monitoring stopped' });
    //   }
    // };
  

    // Add your actual controller methods here
  
    const checkTankLevels = async () => {
      try {
          const ranges = ['Sheet1!C2:C', 'Sheet1!D2:D', 'Sheet1!E2:E'];
          const responses = await Promise.all(
              ranges.map(range => sheetService.getSheetData(range))
          );
  
          console.log("Tank levels checked successfully.");
          // You can add logic here to process the tank levels
  
      } catch (error) {
          console.error("Tank monitoring error:", error);
      }
  };
  
const handleStartMonitoring = async (req, res) => {
  if (!state.monitoringInterval) {
    state.monitoringInterval = setInterval(async () => {
      try {
        await checkTankLevels();
      } catch (error) {
        console.error('Monitoring error:', error);
      }
    }, 3000);
    res.status(200).json({ message: 'Monitoring started' });
  } else {
    res.status(200).json({ message: 'Monitoring already running' });
  }
};

const handleStopMonitoring = async (req, res) => {
  if (state.monitoringInterval) {
    clearInterval(state.monitoringInterval);
    state.monitoringInterval = null;
    res.status(200).json({ message: 'Monitoring stopped' });
  } else {
    res.status(200).json({ message: 'No active monitoring' });
  }
};

const getState = () => ({
  pumpStatus: state.pumpStatus,
  valveStatus: state.valveStatus,
  isMonitoringActive: !!state.monitoringInterval,
  previousLevels: state.previousLevels,
  
});

  return {
    handleStartMonitoring,
    handleStopMonitoring,
    getState
  };
};