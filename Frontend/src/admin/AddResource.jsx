import { Button } from "@/components/ui/button";
import React, { useState } from "react";
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
import { AddResourceValidation} from "@/lib/validation";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";
import axios from "axios";
import { useUserContext } from "@/context/AuthContext";
axios.defaults.withCredentials = true;

function  AddResource() {
  const [submitform, setSubmitForm] = useState(false);
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(AddResourceValidation),
    defaultValues: {
      type: "",
      description: "",
      count:"",
    },
  });

  async function onSubmit(values) {
    try {
      setSubmitForm(true);
      await axios
        .post(`${import.meta.env.VITE_API_URI}/api/v1/admin/addresource`, values)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log("error ", err);
        });
      form.reset();
      setSubmitForm(false);
      navigate("/admin/allresources");
    } catch (error) {
      setSubmitForm(false);
      console.log("Something happening wrong in registering the user ", error);
    }
  }

  return (
    <div className="w-full flex justify-center  bg-gray-100 min-h-screen ">
      <div
        className="lg:w-[55%] sm:w-[70%] w-[90%] flex  rounded-3xl p-4 mt-4 h-[400px] bg-white gap-0  z-100 flex-col "
      >
   
      <h1 className="font-bold sm:text-2xl text-lg  text-center p-4">
         Add Resource
      </h1>
        <div className="flex pb-8 px-4 items-center  justify-center w-[100%]">
          <Form {...form}>
            <div className="sm:w-420 flex-col xss:w-840  w-[100%] ">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2 w-[100%] mt-1"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource Type</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="engineer"
                            {...field}
                            className="border rounded p-2 pl-8"
                          />
                        
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
                          <Input
                            type= "text"
                            placeholder="FullStack Developer"
                            {...field}
                            className="border rounded p-2 pl-8"
                          />
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
                          <Input
                            type= "text"
                            placeholder="1"
                            {...field}
                            className="border rounded p-2 pl-8"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-blue-500">
                  {submitform ? (
                    <div className="flex gap-2">
                      <Loader />
                      <p>Adding...</p>
                    </div>
                  ) : (
                    "Add Resource"
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

export default AddResource;
