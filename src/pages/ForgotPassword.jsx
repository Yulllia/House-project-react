import { useState } from "react"
import { Link } from "react-router-dom"
import { sendPasswordResetEmail, getAuth } from "firebase/auth"
import { toast } from "react-toastify"
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const onChange = (e) => {
    setEmail(e.target.value)
  }
  const onSubmit = async(e) => {
    e.preventDefault()
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email)
      toast.success("Email was sent")
    } catch {
      toast.error("Coudln't reset email")
    }
  }
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <input type="email" onChange={onChange} id="email" value={email} className="emailInput" placeholder="Email" />
          <Link className="forgotPasswordLink" to="/sign-in">Sign in</Link>
          <div className="signInBar">
            <div className="signInText">Send reset Link</div>
            <button className="signInButton">
              <ArrowRightIcon fill="#ffffff" height="34px" width="34px" />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default ForgotPassword