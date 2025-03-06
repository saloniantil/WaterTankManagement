import ToggleBtn from "../hooks/ToggleBtn"
const EachTank = ({ tankNumber, waterLevel, solenoidValveStatus, onToggle, isNodeMcuOnline, isEsp32Online  }) => {

    const getWaterLevelColor = (level) => {
        if (level <= 20) return "bg-red-500";
        if (level > 20 && level <= 60) return "bg-yellow-500"; 
        return "bg-blue-500"; 
    };

    return (
        <div className="card lg:w-[300px] sm:w-[500px] w-[400px]">
            <div className="card-content">
                <div className="tank-heading-small">Tank { tankNumber }</div>
                <div className="reading-box">
                    <p className="status">Water Level: <span>{ waterLevel }%</span></p>
                    <p className="status">Solenoid Valve: <span style={{ color: 'rgb(0, 60, 255)' }}>{solenoidValveStatus}</span>
                        {localStorage.getItem("editAccess") === "false" ? null : <ToggleBtn status={solenoidValveStatus} onToggle={() => onToggle(tankNumber)} />}
                    </p>
                    <p className="status">NodeMCU Status: <span style={{ color: 'rgb(0, 60, 255)' }}>{isNodeMcuOnline  ? "🟢 Online" : "🔴 Offline"}</span></p>
                    <p className="status">ESP32 Status: <span style={{ color: 'rgb(0, 60, 255)' }}> {isEsp32Online? "🟢 Online" : "🔴 Offline"}</span></p>
                </div>
                <div className="water-level-box">
                    <div className="water-level-container">
                        <div className="tank-markings">
                        {[90, 80, 70, 60, 50, 40, 30, 20, 10].map((percent, index) => (
                            <div className="marking" style={{ gridRow: index + 2 }} key={percent}>
                            <div className="marking-label">{percent}%</div>
                            </div>
                        ))}
                        </div>
                        <div className={`absolute bottom-0 w-full transition-all duration-500 ${getWaterLevelColor(waterLevel)}`} style={{ height: `${waterLevel}%` }}></div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
export default EachTank;