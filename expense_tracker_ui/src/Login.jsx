import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [inputText, setText] = useState({
        username:"",
        password:""
    })
    const [isAccepted, setIsAccepted]= useState(true);

    const navigate= useNavigate();


    async function handleClick (event) {
        event.preventDefault();

        try {
          const result=  await axios.post("http://localhost:3000/login", inputText, { withCredentials: true })
            if (result.data.success) {
                navigate("/dashboard");
                console.log(result.data.success)
            } else {
                return ("Wrong email or password") 
            }
        } catch(error) {
            setIsAccepted(false)
            console.error(error);
        }
    }

    function handleRegister() {
        navigate("/register")
    }

    function handleChange(event) {
        const {name,value} = event.target;

        setText(prevValue => {
            return{...prevValue, [name]: value}
        })
    }
    
    return(
    <form className="form">
        <div className="header">
        <h1>Expense Tracker</h1>
        </div>

        <div className="container">
            <div className="login">
                <h2>Sign In</h2>
                <div className="login-box">
                    <label htmlFor="username">Email</label>
                    <input type="text" onChange={handleChange} name="username" id="username" value={inputText.username}  style={{ border: isAccepted? "" : "1px solid red" }}/>
                </div>
                <div className="login-box">
                    <label htmlFor="password">Password</label>
                    <input type="password" onChange={handleChange} name="password" id="password" value={inputText.password}  style={{ border: isAccepted? "" : "1px solid red" }}/>
                </div>
                <a href="/forgot" className="text">Forgot Password?</a>
                <p className="loginError" style={{display: isAccepted? "none" : "inline-block"}}>Wrong Email or Password</p>
                <button className="btn" onClick={handleClick} type="submit">Login</button>
            </div>

            <hr className="line"/>OR <hr className="line"/>

            <div className="register">
                <h2>Register if new</h2>
                <button onClick={handleRegister} className="btn" type="submit">Sign up</button>
            </div>
        </div>
    </form>)
}

export default Login;