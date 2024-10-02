import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { AddResourceValidation } from "@/lib/validation";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useMessageContext } from "@/context/MessageContext";
axios.defaults.withCredentials = true;
function UpdateResource() {
  const { message, messageType,setMessage,setMessageType } = useMessageContext();
  const location = useLocation();
  const resource = location.state?.resource.resource;
  const navigate = useNavigate();
  const [submitForm, setSubmitForm] = useState(false);
  const form = useForm({
    resolver: zodResolver(AddResourceValidation),
    defaultValues: {
      type: resource?.type || "",
      description: resource?.description || "",
      count: resource?.count.toString() || "",
    },
  });

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000); // 10 seconds

      return () => clearTimeout(timer); // Cleanup timer on unmount or if message changes
    }
  }, [message, setMessage]);
  

  async function onSubmit(values) {
    try {
      setSubmitForm(true);

      await axios
        .post(`${import.meta.env.VITE_BACKEND_API_URI}/api/v1/admin/updateresource/${resource?._id}`, values,{
          withCredentials:true
        })
        .then((res) => {
          console.log(res);
          setMessageType("success");
          setMessage("Resource Updated Successfully");
          navigate("/admin/allresources");
        })
        .catch((err) => {
          console.log("error ", err);
          setMessageType("error");
          setMessage("Some Error Occured");
        });
      form.reset();
      setSubmitForm(false);
      
    } catch (error) {
      setSubmitForm(false);
      console.log("Something happening wrong in updating the resource ", error);
      setMessageType("error");
      setMessage("Some Error Occured");
    }
  }

  return (
    <div className="w-full flex flex-col items-center mt-8 bg-gray-100 h-screen">
           {message && (
              <div className={`message ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'} p-2 mb-1 text-white text-center`}>{message}</div>
             )}
      <div className="lg:w-[55%] sm:w-[70%] w-[90%] flex rounded-3xl p-4 mt-4 bg-white gap-0 z-100 flex-col h-[400px]">
        <h1 className="font-bold text-2xl sm:text-xl text-center p-4">Update Resource</h1>
        <div className="flex pb-8 px-4 items-center justify-center w-[100%]">
          <Form {...form}>
            <div className="sm:w-420 flex-col w-[100%]">
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 w-[100%] mt-1">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource Type</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="text" {...field} className="border rounded p-2 pl-8" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="text" {...field} className="border rounded p-2 pl-8" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Count</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="text" {...field} className="border rounded p-2 pl-8" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-black">
                  {submitForm ? (
                    <div className="flex gap-2">
                      <Loader />
                      <p>Updating...</p>
                    </div>
                  ) : (
                    "Update Resource"
                  )}
                </Button>
              </form>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default UpdateResource;
