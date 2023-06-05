import React, { useState } from 'react'
import { useNavigate } from "react-router";
import { useContext } from 'react'
import noteContext from '../context/notes/NoteContext';


const Login = () => {
    const context = useContext(noteContext);
    const { showAlert } = context;

    const[credential, setCredential] = useState({email: "", password:""});
    let navigate = useNavigate();

    const handleSubmit =async (e)=>{
        e.preventDefault();
        const response = await fetch(`http://127.0.0.1:5000/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email: credential.email, password:credential.password}),
          });
          const json = await response.json();
          console.log(json)
          if(json.success){
            // redirect
            localStorage.setItem('token', json.authtoken);
            navigate("/");
            showAlert("Login Successful", "success");
          }
          else{
            showAlert("invalid credentials", "danger");
          }
    }
   

    const onChange = (e)=>{
        setCredential({...credential,[e.target.name]: e.target.value})
    }
    return (
        <div>
            <h2 className='mt-2'>Login to continue to iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" value={credential.email} onChange={onChange} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' value={credential.password} onChange={onChange}/>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    )
}

export default Login
