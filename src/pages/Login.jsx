import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../Styles/Login.css";

function Login() {
// the variables 
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate(); // tool that let's you jump to another page
  const [message,setMessage] = useState("");

  const handleLogin = (e) => {

    e.preventDefault(); // stops the page from refreshing default browser behavior
  // checking fields
    if(email === "" || password === ""){
      alert("Please fill all fields");
      return;
    }
// sending data to the backend 
fetch("http://localhost/PFE_backend/login.php",{
  method:"POST",
  headers:{
    "Content-Type":"application/json"
  },
  body:JSON.stringify({email,password}) // the email and the pass packed as JSON 
})

//Reading the response from the backend 
.then(async res => {

  const text = await res.text();
  console.log("SERVER RESPONSE:", text);

  return JSON.parse(text);

})

.then(data => {

if (data.message === "Login successful") {

  const user = data.user;

  setMessage("Welcome " + user.first_name);

  // save logged user
  localStorage.setItem("user", JSON.stringify(user));

  setTimeout(() => {

    if (user.role === "employee") {
      navigate("/employee");
    } 
    else if (user.role === "manager") {
      navigate("/manager");
    } 
    else {
      navigate("/dashboard");
    }

  }, 1000);

} else {
  alert(data.message);
}

})
.catch((err)=>{
  console.log(err);
  alert("Server error");
});

  };

  return(

    <div className="login-page">
      {/* Glow background circles */}
  <div className="glow-circle gc1"></div>
  <div className="glow-circle gc2"></div>
  

      <div className="particles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="quote">
        <h1>
         <br/>
        <br/>
          
        </h1>
      </div>

      <div className="login-container">

        <img src="/logo.jpg"
         width="150" alt="logo"/>

        <h2>Welcome</h2>
        <p>Sign in to your account</p>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          <div className="remember-me">
            <label><input type="checkbox"/> Remember me</label>
            <a href="#">Forgot password?</a>
          </div>

          <p style={{color:"green"}}>{message}</p>

          <button className="login-btn">
            Login
          </button>

        </form>

        <div className="signup">
          <p>Don't have an account? <a href="#">Sign up</a></p>
        </div>

        <div className="footer-text">
          © 2026 Mission Management Platform
        </div>

      </div>

    </div>

  );

}

export default Login;