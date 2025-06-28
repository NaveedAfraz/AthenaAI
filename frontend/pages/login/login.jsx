import Footer from "@/components/common/layouts/footer";
import Navbar from "@/components/common/layouts/navbar";
import { SignIn } from "@clerk/clerk-react";
import React from "react";

function Login() {
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <SignIn signUpUrl="register" />
      </div>
      <Footer />
    </>
  );
}

export default Login;
