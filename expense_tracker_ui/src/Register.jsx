import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Register() {
    const [inputText, setText] = useState({
        username:"",
        password:""
    })

    const [isRegistered, setIsNotRegistered] = useState(true);

    const navigate=useNavigate();

    async function handleClick (event) {
        event.preventDefault();

        try {
            await axios.post("/register", inputText, { withCredentials: true })
            navigate("/")
        } catch(error) {
           setIsNotRegistered(false);
            console.error(error);
        }
    }

    function handleChange(event) {
        const {name,value} = event.target;

        setText(prevValue => {
            return{...prevValue, [name]: value}
        })
    }
    
    return(
    <form className="form">
        <div className="register-container">
            <div className="main-register">
                <h2>Register</h2>
                <div className="box">
                    <label htmlFor="email">Email</label>
                    <input type="text" onChange={handleChange} name="username" id="email" value={inputText.username}/>
                </div>
                <div className="box">
                    <label htmlFor="password">Password</label>
                    <input type="password" onChange={handleChange} name="password" id="password" value={inputText.password}/>
                </div>
                <button className="btn" onClick={handleClick} type="submit">Register</button>
            </div>
            <p className="registerError" style={{display: isRegistered? "none"  : "inline-block" }}>Email already exists. Try logging in</p>
        </div>
    </form>)
}

export default Register;