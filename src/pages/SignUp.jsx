import { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from "../firabase.config"
import { doc, setDoc,serverTimestamp } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function SignUp() {
  const [showpPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;
  const navigate = useNavigate();


  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      updateProfile(auth.currentUser, { displayName: name });

      const copyFormData = {...formData};
      delete copyFormData.password;
      copyFormData.timestamp = serverTimestamp();
      await setDoc(doc(db, 'users', user.uid),copyFormData);

      navigate("/");
    } catch (error) {
      toast.error("Something wrong with registration")
    }
  }

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome Back!</p>
      </header>
      <form onSubmit={onSubmit}>
        <input
          className="nameInput"
          type="text"
          placeholder="Name"
          id="name"
          value={name}
          onChange={onChange}
        />
        <input
          className="emailInput"
          type="email"
          placeholder="Email"
          id="email"
          value={email}
          onChange={onChange}
        />
        <div className="passwordInputDiv">
          <input
            type={showpPassword ? "text" : "password"}
            placeholder="Password"
            className="passwordInput"
            id="password"
            value={password}
            onChange={onChange}
          />
          <img
            className="showPassword"
            src={visibilityIcon}
            alt="show Password"
            onClick={() => setShowPassword((prevState) => !prevState)}
          />
        </div>

        <Link to="/forgotpassword" className="forgotPasswordLink">
          Forgot Password
        </Link>

        <div className="signUpBar">
          <p className="signUpText">Sign up</p>
          <button className="signUpButton">
            <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
          </button>
        </div>
      </form>

      <Link to="/sign-in" className="registerLink">
        Sign up Instead
      </Link>
    </div>
  );
}

export default SignUp;
