import { SignIn } from "@clerk/clerk-react";
import React from "react";

function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn signUpUrl="register"/>
    </div>
  );
}

export default Login;
