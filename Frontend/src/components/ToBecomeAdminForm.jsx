import React, { useState } from 'react'
import { Input } from './ui/input'
import axios from 'axios';
import { formValidationSchema } from '@/lib/validation';

function ToBecomeAdminForm() {
    const [submitform,setSubmitForm]=useState(false)
    const [ownerEmail,setOwnerEmail]=useState("");
    const [msg,setMsg]=useState("");
    const [error,setError]=useState("");
    const  handleSendEmail = async(e) => {
        e.preventDefault();
          try {
          setSubmitForm(true);
          formValidationSchema.parse({ownerEmail});
          await axios.post(`/api/v1/users/sendEmailToBecomeOwner`
            ,{ownerEmail})
          .then((res)=>{
            console.log(res.data.data);
             setMsg(res.data.data);
            setTimeout(() => {
              setMsg("");
             }, 5000);
          })
          .catch((err)=>{
            console.log("some error occcur ",err);
          })
          setSubmitForm(false);
          setOwnerEmail("");
    } catch (error) {
     setSubmitForm(false);
     console.log("error occured ",error);
     setError(error?.errors[0]?.message);
      setTimeout(() => {
        setError("");
       }, 5000);
    
      };
    }

  return (
        <div className="flex flex-col bg-black mx-auto sm:px-16 sm:py-8 p-6 mb-8 rounded-3xl items-center justify-center lg:w-[70%] md:w-[80%] w-[90%] gap-8">
          <div className="flex flex-col items-center justify-start w-full pb-[3px] gap-4 md:gap-[26px]">
            <h1 className="!text-white text-2xl !font-metropolis text-center lg:text-[35px] font-bold md:leading-[45px]">
             Create Own Company 
            <br />
            and to Become Admin
            </h1>
            <p className="!text-gray-500 text-center !text-base !font-normal   leading-5">
              100+ companies are registered  On Bench Sharing Portal. Send Your Email to become Part of it.
            </p>
          </div>
          <div className="flex sm:flex-row flex-col sm:gap-0 gap-4  justify-center w-full ">
            <Input
              
              type="email"
              name="ownerEmail"
              value={ownerEmail}
              onChange={(e) =>
                setOwnerEmail(e.target.value )
              }
              required
              placeholder="enter your email"
              className="sm:w-[50%] text-black pl-10  font-medium sm:rounded-tr-[0px] sm:rounded-br-[0px] "
            />
            <button className="bg-red-400 h-[40px] text-white text-base rounded-[8px] sm:rounded-tl-[0px] sm:rounded-bl-[0px] font-medium min-w-[160px] hover:bg-red-600" onClick={handleSendEmail}>
              {!submitform?"To Become Owner":"Sending..."}
            </button>
          </div>
          <p className="!text-gray-500 text-center !text-base !font-normal leading-5">{msg}{error}</p>
        </div>
  )
}
export default ToBecomeAdminForm

