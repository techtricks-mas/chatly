import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";

const ForgotPassword = () => {
  const auth = getAuth();
  let [email, setEmail] = useState("");
  
  let handleEmail = (e) => {
    setEmail(e.target.value);
  };
  
  let navigate = useNavigate();
  let handleUpdate = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Check your gmail to reset password");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        const errorCode = error.code;
        toast.error(errorCode);
      });
  };

  return (
    <div className="bg-heading w-full h-screen flex justify-center items-center">
      <ToastContainer position="bottom-center" theme="dark" />
      <div className="bg-white w-96 p-5">
        <div className="text-white text-center font-opensans font-bold text-xl">
          Forgot Password
        </div>
        <div className="relative mt-16">
          <input
            type="email"
            className="border-para border-solid border w-full rounded-lg py-6 px-14"
            onChange={handleEmail}
          ></input>
          <p className="font-nunito font-semibold text-sm text-heading absolute top-[-9px] left-9 bg-white px-5">
            Email Address
          </p>
          <button
            onClick={handleUpdate}
            className="bg-indigo-600 font-nunito font-semibold text-xl text-white p-5 rounded mt-5"
          >
            Update
          </button>
          <button className="bg-indigo-600 font-nunito font-semibold text-xl ml-6 text-white p-5 rounded mt-5">
            <Link to="/login">Back to Login</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
