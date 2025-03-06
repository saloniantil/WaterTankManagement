import React from 'react';

const ToggleButton = ({ status, onToggle }) => {
    
return (
 <button className='toggleButtonHook' onClick={onToggle}>
    {status === 'on'? "Turn off" : "Turn on"}
 </button>
 );
};
export default ToggleButton;