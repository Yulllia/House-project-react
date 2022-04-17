import { useState } from "react"
import { Link } from "react-router-dom"
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg"
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import OAuth from "../components/OAuth";

function SignIn() {
  const [showpPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { email, password } = formData
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }
  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        navigate("/profile")
      }
    } catch (error) {
      toast.error("Bad cradentials")
    }
  }

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome Back!</p>
      </header>
      <form onSubmit={onSubmit}>
        <input className="emailInput" type="email" placeholder="Email" id="email" value={email} onChange={onChange} />
        <div className="passwordInputDiv">
          <input type={showpPassword ? "text" : "password"} placeholder="Password" className="passwordInput" id="password" value={password} onChange={onChange} />
          <img className="showPassword" src={visibilityIcon} alt="show Password" onClick={() => setShowPassword((prevState) => !prevState)} />
        </div>

        <Link to="/forgotpassword" className="forgotPasswordLink">
          Forgot Password
        </Link>

        <div className="signInBar">
          <p className="signinText">Sign in</p>
          <button className="signInButton">
            <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
          </button>

        </div>
      </form>

      <OAuth />
      
      <Link to="/sign-up" className="registerLink">
        Sign ip Instead
      </Link>
    </div>
  )
}

export default SignIn