import React from 'react';

const ToggleButton = ({ status, onToggle }) => {
    
return (
   <button className={` toggleButtonHook ${status === 'off' ? 'green-button' : 'red-button'}`} onClick={onToggle}>
    {status === 'on'? "Turn off" : "Turn on"}
 </button>
 );
};
export default ToggleButton;