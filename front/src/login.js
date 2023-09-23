import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import './login.css';

const Login = () => {

    let navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/auth');
    };

    return <div className='outerContainer'>
        <h4 className='mainHeading'>Mailendar - Sort Important Mails</h4>
        <h5 className='sideHeading'>Click Here for Gmail Login</h5>
        <div className='button-container'>
            <button className='buttonSexy' onClick={handleRedirect}>LOGIN</button>
        </div>
    </div>
};
 
export default Login;