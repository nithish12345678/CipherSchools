import logo from './logo.svg';
import './App.css';
import React ,{useState, useEffect,createContext, useContext } from 'react';
import { BrowserRouter,Switch, Link, Route, Routes,useNavigate } from "react-router-dom";
import Profile from "./components/Profile"
import Signin from "./components/Signin"
import Signup from "./components/Signup"

export const UserContext = createContext();

const Routing = ()=>{
  const navigate = useNavigate()
  const {state,dispatch} = useContext(UserContext)

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
      navigate("/")
    }else{
      navigate("/signin")
    }
      
  }, [])
  return(
    <Routes >
      <Route path="/signin" element ={ <Signin />} />

      <Route path="/signup" element ={ <Signup />} />

      <Route exact path="/profile" element ={  <Profile />} />
    </Routes>
  )
}





function App() {



return (

<div>
<BrowserRouter>

<nav>
    <div>
      <Link to="/profile">Profile</Link>
    </div>
    <div>
      <Link to="/Signup">Signup</Link>
    </div>
  </nav>
  <Routing/>

</BrowserRouter>
</div>
    
    
  );
}

export default App;
