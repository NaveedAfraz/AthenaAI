import { SignUp } from "@clerk/clerk-react";
import React from "react";
import Navbar from "@/components/common/layouts/navbar";
import Footer from "@/components/common/layouts/footer";

function Register() {
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <SignUp signInUrl="/login" />
      </div>
      <Footer />
    </>
  );
}

export default Register;
