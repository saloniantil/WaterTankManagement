import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { addUser } from '../utils/Slices/userSlice';
import axios from 'axios';
const LoginPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [emailId , setEmailId] = useState("");
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    
    const handleLogin = async () => {
        try {
            console.log("happy login")
            const res = await axios.post("http://localhost:3000/login",
                {
                    emailId,
                    password
                },
                { withCredentials: true }
            );
            dispatch(addUser(res.data.data));
            return navigate("/edit-and-view-Or-View-Only")
        } catch (err) {
            setErrorMsg(err.response.data.message);
            console.error("Error in LogIn " , err.message )
        }
    };
    
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }
    
    return (
        <div className={`login-page`}>
            <h1>WELCOME TO THE WATER TANK MONITORING SYSTEM</h1>

            <div className="login-container">
                <h1>LogIn</h1>
                
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Enter Email"
                        value={emailId}
                        onChange={(e) => setEmailId(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        id="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                        {isPasswordVisible ? '🙈' : '👁'}
                    </span>
                </div>

                <button className='loginBtn' onClick={handleLogin}>Login</button>

                {errorMsg && <div className="mt-4 text-red-600 font-semibold text-sm">{errorMsg}</div>}
            </div>

        </div>
    );  
}
export default LoginPage;