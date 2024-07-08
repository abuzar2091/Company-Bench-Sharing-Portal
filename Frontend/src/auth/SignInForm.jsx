import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { SignInValidation } from "@/lib/validation";
import { Link, useNavigate } from "react-router-dom";
import '../css/gradient.css';
import Loader from "@/components/Loader";
import axios from "axios";
import { useUserContext } from "@/context/AuthContext";
import { useMessageContext } from "@/context/MessageContext";

function SignInForm() {
  const [eye, setEye] = useState(true);
  const [check, setCheck] = useState(false);
  const [isChecked,setIsChecked]=useState("");
  const [submitForm, setSubmitForm] = useState(false);
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { message, messageType,setMessage,setMessageType } = useMessageContext();
  const navigate = useNavigate();
  useEffect(()=>{
      setTimeout(()=>{setIsChecked("")},5000);
  },[isChecked])

  const form = useForm({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      setSubmitForm(true);
      if (!check) {
        setIsChecked("Read and check the terms and condition");
        setSubmitForm(false);
     return;
   }
  //  with this 
  //  ,{
  //   withCredentials: true, // Ensure cookies are sent with the request
  // }
      await axios.post(`${import.meta.env.VITE_BACKEND_API_URI}/api/v1/users/login`,values, {
        withCredentials: true, // Ensure cookies are sent with the request
      })
        .then((res) => {
          console.log(res);
          setMessage("User Logged In Successfully");
          setMessageType('success');
          navigate("/");
        })
        .catch((err) => {
          console.log("error ", err);
          setMessage("Entered Wrong Email or password");
          setMessageType('error');
        });
      checkAuthUser();
      form.reset();
      setSubmitForm(false);
    } catch (error) {
      setSubmitForm(false);
      console.log("Something went wrong in registering the user ", error);
    }
  }
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 7000); // 10 seconds

      return () => clearTimeout(timer); // Cleanup timer on unmount or if message changes
    }
  }, [message, setMessage]);
  return (
    <div className="w-full flex flex-col items-center mt-4 bg-gray-100 min-h-screen">
       {message && (
              <div className={`message ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'} p-2 mb-1 text-white`}>{message}</div>
         )}
      <div className="flex rounded-3xl bg-white gap-10 mt-8  md:flex-row md:h-[400px]  xl:w-[60%] lg:w-[70%] sm:w-[70%] w-[90%] flex-col">
        <div className="gradient-bg flex items-center justify-center lg:w-[55%]  rounded-tl-3xl md:rounded-bl-3xl md:rounded-tr-[0px] rounded-tr-3xl">
          <div className="z-10 flex flex-col items-start gap-4 p-8 shadow-lg">
            <img src="/images/logo4.png" className="sm:w-[200px] w-[180px]" alt="Logo" />
            <h1 className="font-bold  sm:text-xl text-lg text-center text-white">
              Welcome to
              <br />
              Bench Sharing Portal
            </h1>
            {isChecked.length>0 && <p className="font-semibold text-red-500">{isChecked}</p>}
          </div>
        </div>
        <div className="md:hidden flex flex-row">
          <div className="border-gray-300 ml-[20px] w-[50px] border-[1px]" />
          <div className="border-gray-400 border-[1px] w-[50px]" />
          <div className="border-gray-800 border-[1px] w-[150px]" />
          <div className="border-gray-400 border-[1px] w-[50px]" />
          <div className="border-gray-300 border-[1px] w-[50px]" />
        </div>
        <div className="hidden md:flex flex-col">
          <div className="border-gray-300 mt-[60px] border-[1px] h-[50px]" />
          <div className="border-gray-400 border-[1px] h-[50px]" />
          <div className="border-gray-800 border-[1px] h-[150px]" />
          <div className="border-gray-400 border-[1px] h-[50px]" />
          <div className="border-gray-300 border-[1px] h-[50px]" />
        </div>
        <div className="mx-auto md:py-4 px-4 py-8 flex items-center lg:w-[400px] md:w-[300px] ">
          <Form {...form}>
            <div className="flex-col w-full">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2 w-full "
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="user@example.com"
                            {...field}
                            className="border rounded p-2 pl-8"
                          />
                          <img
                            src="/assets/icons/msg.svg"
                            alt="Account icon"
                            className="absolute top-3 left-2 w-4 h-4 pointer-events-none"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={eye ? "password" : "text"}
                            placeholder="************"
                            {...field}
                            className="border rounded p-2 pl-8"
                          />
                          <img
                            src="/assets/icons/locked.svg"
                            alt="Account icon"
                            className="absolute top-2 left-2 w-4 h-4 pointer-events-none"
                          />
                          <img
                            src={eye ? "/assets/icons/eye.svg" : "/assets/icons/eye-off.svg"}
                            alt="Account icon"
                            className="absolute top-3 right-3 w-4 h-4 cursor-pointer"
                            onClick={(e) => setEye((prev) => !prev)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-blue-500">
                  {submitForm ? (
                    <div className="flex gap-2">
                      <Loader />
                      <p>Loading...</p>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
              <div className="flex justify-center cursor-pointer items-center gap-2 mt-4">
                <img
                  src={check ? "/assets/icons/square-check.svg" : "/assets/icons/checked.svg"}
                  onClick={(e) => setCheck((prev) => !prev)}
                />
                <p className="text-sm">I agree to the terms and conditions</p>
              </div>
              <p className="text-small-regular text-sm text-light-2 text-center mt-2">
                Already have an account?
                <Link to="/signup" className="text-primary-500 text-small-semibold ml-1 text-blue-600">
                  Sign Up
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignInForm;


