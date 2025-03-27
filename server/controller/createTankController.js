export const createTankController = (sheetService) => {
  const state = {
      pumpStatus: "off",
      valveStatus: { 1: "off", 2: "off", 3: "off" },
      previousLevels: { 1: 30.0, 2: 30.0, 3: 30.0 },
      monitoringInterval: null
  };

  const logStatus = async () => {
      const currentTime = new Date();
      const statusRow = [
          currentTime.toISOString().split('T')[0], // Date
          currentTime.toTimeString().split(' ')[0], // Time
          state.valveStatus[1], 
          state.valveStatus[2], 
          state.valveStatus[3], 
          state.pumpStatus
      ];
      try {
          await sheetService.appendStatus(statusRow);
      } catch (error) {
          console.error('Error logging status:', error);
      }
  };

  const controlPump = (action) => {
      if (action === 'on' && state.pumpStatus === 'off') {
          console.log('Turning pump ON');
          state.pumpStatus = 'on';
      } else if (action === 'off' && state.pumpStatus === 'on') {
          console.log('Turning pump OFF');
          state.pumpStatus = 'off';
      }
  };

  const formatDate = (date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${
            (date.getMonth() + 1).toString().padStart(2, '0')}/${
            date.getFullYear()}`;
    };
    
  const checkTankLevels = async () => {
      try {
        const currentTime = new Date();
        const formattedRow = [
            formatDate(currentTime),
            currentTime.toTimeString().split(' ')[0], // Time
            state.previousLevels[1], // Node1 Distance
            state.previousLevels[2], // Node2 Distance
            state.previousLevels[3]  // Node3 Distance
        ];
      await sheetService.appendTank(formattedRow);
          const ranges = ['tank!C2:C', 'tank!D2:D', 'tank!E2:E'];
          const responses = await Promise.all(
              ranges.map(range => sheetService.getSheetData(range))
          );

          const values = {
              1: responses[0].map(row => parseFloat(row[0]) || 0),
              2: responses[1].map(row => parseFloat(row[0]) || 0),
              3: responses[2].map(row => parseFloat(row[0]) || 0)
          };

          // Get the latest levels
          const levels = {};
          for (let tank in values) {
              const latest = values[tank].length ? values[tank][values[tank].length - 1] : state.previousLevels[tank];
              levels[tank] = latest > 60 ? state.previousLevels[tank] : latest;
              state.previousLevels[tank] = levels[tank];
          }

          // Convert to percentage (assuming full tank is 100% and empty is 0%)
          const percentages = {
              1: ((58 - levels[1]) / (58 - 18)) * 100,
              2: ((58 - levels[2]) / (58 - 18)) * 100,
              3: ((58 - levels[3]) / (58 - 18)) * 100
          };

          console.log("Tank Levels:", percentages);

          // Conditions to control the pump and valves
          const below20 = Object.values(percentages).some(p => p <= 20);
          const below60Count = Object.values(percentages).filter(p => p <= 60).length;

          if (below20 || below60Count >= 2) {
              if (state.pumpStatus === "off") {
                  console.log("Pump trigger condition met, turning ON");
                  for (let tank in percentages) {
                      if (percentages[tank] < 100) {
                          state.valveStatus[tank] = "on";
                      }
                  }
                  logStatus();
                  setTimeout(() => controlPump("on"), 10000); // Delay before turning pump on
                  logStatus();
              }
          }

          if (state.pumpStatus === "on") {
              for (let tank in percentages) {
                  if (percentages[tank] >= 100 && state.valveStatus[tank] === "on") {
                      state.valveStatus[tank] = "off";
                      console.log(`Valve closed for Tank ${tank}`);
                  }
              }

              const openValves = Object.keys(state.valveStatus).filter(t => state.valveStatus[t] === "on");

              if (openValves.length === 0) {
                  controlPump("off");
                  logStatus();
              } else if (openValves.length === 1) {
                  const lastTank = openValves[0];
                  if (percentages[lastTank] >= 95) {
                      controlPump("off");
                      logStatus();
                      setTimeout(() => {
                          state.valveStatus[lastTank] = "off";
                          logStatus();
                          console.log(`Closing last valve for Tank ${lastTank}`);
                      }, 10000);
                  }
              }
          }

          logStatus();

      } catch (error) {
          console.error("Tank monitoring error:", error);
      }
  };

  const handleStartMonitoring = async (req, res) => {
      if (!state.monitoringInterval) {
          state.monitoringInterval = setInterval(async () => {
            try {
              console.log("updating google sheets");
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
