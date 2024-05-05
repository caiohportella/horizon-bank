import AuthForm from "@/components/AuthForm";
import React from "react";

const SignUpPage = () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="sign-up" />
    </section>
  );
};

export default SignUpPage;
