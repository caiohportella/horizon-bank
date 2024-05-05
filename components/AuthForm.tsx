"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField from "./CustomFormField";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import SignInPage from "@/app/(auth)/sign-in/page";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();

  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address1: "",
      city: "",
      state: "",
      postalCode: "",
      dateOfBirth: "",
      ssn: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      if (type === "sign-up") {
        const newUser = await signUp(values);
        setUser(newUser);
      }
      if (type === "sign-in") {
        const res = await signIn({
          email: values.email,
          password: values.password,
        });

        if (res) router.push("/");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer items-center gap-1 flex">
          <Image
            src="/icons/logo.svg"
            alt="horizon logo"
            width={34}
            height={34}
          />
          <h1 className="text-26 font-ibm font-bold text-black-1">Horizon</h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {user
              ? "Link your account to get started"
              : "Please enter your details"}
          </p>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4"></div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomFormField
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder=""
                    />
                    <CustomFormField
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder=""
                    />
                  </div>
                  <CustomFormField
                    control={form.control}
                    name="address1"
                    label="Address"
                    placeholder="Enter your specific address"
                  />
                  <CustomFormField
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder=""
                  />
                  <div className="flex gap-4">
                    <CustomFormField
                      control={form.control}
                      name="state"
                      label="State"
                      placeholder="ex: NY"
                    />
                    <CustomFormField
                      control={form.control}
                      name="postalCode"
                      label="Postal Code"
                      placeholder="ex: 11101"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomFormField
                      control={form.control}
                      name="dateOfBirth"
                      label="Date of Birth"
                      placeholder="yyyy-mm-dd"
                    />
                    <CustomFormField
                      control={form.control}
                      name="ssn"
                      label="SSN"
                      placeholder="ex: 1234"
                    />
                  </div>
                </>
              )}
              <CustomFormField
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
              <CustomFormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="enter your password"
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
