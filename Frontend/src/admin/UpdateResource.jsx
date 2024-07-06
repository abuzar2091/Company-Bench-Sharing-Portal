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
axios.defaults.withCredentials = true;
function UpdateResource() {
  const location = useLocation();
  const resource = location.state?.resource.resource;
  const navigate = useNavigate();
  const [submitForm, setSubmitForm] = useState(false);
  const form = useForm({
    resolver: zodResolver(AddResourceValidation),
    defaultValues: {
      type: resource?.type || "",
      description: resource?.description || "",
      count: resource?.count || "",
    },
  });
  

  async function onSubmit(values) {
    try {
      setSubmitForm(true);

      await axios
        .post(`${import.meta.env.VITE_API_URI}/api/v1/admin/updateresource/${resource?._id}`, values)
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
      console.log("Something happening wrong in updating the resource ", error);
    }
  }

  return (
    <div className="w-full flex justify-center  bg-gray-100 h-screen">
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
                <Button type="submit" className="bg-blue-500">
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
