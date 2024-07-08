import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useMessageContext } from "@/context/MessageContext";
import ToBecomeAdminForm from "./ToBecomeAdminForm";
import FilterResources from "./FilterResources";
import useDebounce from "@/hooks/useDebounce";
import { useFilterContext } from "@/context/FilterContext";
axios.defaults.withCredentials = true;
function HomePage() {
  const [showResources, setShowResources] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCounts, setSelectedCounts] = useState({});
  const navigate = useNavigate();
  const { message, messageType, setMessage, setMessageType } =
    useMessageContext();
  const { filter, setFilter } = useFilterContext();
  const [searchBarValue, setSearchBarValue] = useState("");
  const debouncedSearchBarValue = useDebounce(searchBarValue, 1000);

  useEffect(() => {
    const getResources = async () => {
      await axios
        .get(`${import.meta.env.VITE_BACKEND_API_URI}/api/v1/application/getresources/${filter}`)
        .then((res) => {
          console.log(res.data.data.resources);
          setShowResources(res.data.data.resources);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getResources();
  }, [filter]);
  const [isBooking, setIsBooking] = useState(false);

  const filteredResources =
    debouncedSearchBarValue?.length > 0 &&
    showResources?.length > 0 &&
    showResources?.filter((resource) =>
      resource.description.toLowerCase().includes(searchBarValue.toLowerCase())
    );
  console.log(filteredResources);
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const words = "Sharing Portal";

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 7000); // 10 seconds

      return () => clearTimeout(timer); // Cleanup timer on unmount or if message changes
    }
  }, [message, setMessage]);
  useEffect(() => {
    let intervalId;
    const typeNextWord = () => {
      if (currentIndex < words.length) {
        setCurrentText((prevtext) => prevtext + words[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    };
    intervalId = setInterval(typeNextWord, 200);
    return () => {
      clearInterval(intervalId);
    };
  }, [currentIndex, words]);

  //Animation to append characters from words to currentText

  useEffect(() => {
    if (currentIndex === words.length) {
      let intervalId;
      const removeLastCharacter = () => {
        if (currentText.length > 0) {
          setCurrentText((prevtext) => prevtext.slice(0, -1)); // Remove last character
        } else {
          clearInterval(intervalId);
          setCurrentIndex(0); // Reset currentIndex after removing all characters
        }
      };
      intervalId = setInterval(removeLastCharacter, 200); // Change word every 200 milliseconds
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [currentIndex, currentText, words]);
  const handleBookResource = async (resourceId, count) => {
    // Handle booking logic here
    setIsBooking(true);
    await axios
      .post(`/api/v1/users/bookresources`, { resourceId, count })
      .then((res) => {
        console.log(res.data);
        setIsBooking(false);
        setMessage("Resource Booked Successfully");
        setMessageType("success");
        navigate("/my-profile");
      })
      .catch((err) => {
        setIsBooking(false);
        console.log(err);
      });
    console.log(`Booking resource with ID: ${resourceId} and count: ${count}`);
  };

  const handleSelectChange = (resourceId, value) => {
    setSelectedCounts((prev) => ({
      ...prev,
      [resourceId]: value,
    }));
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-100 flex gap-4 pt-5 justify-center">
        <Loader />
        Loading...
      </div>
    );
  }

  console.log("filter value bar ", searchBarValue);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div
        className=" flex py-5  justify-center  gap-5  bg-blue-400 w-full
       "
      >
        <div className="flex justify-start gap-4 xl:min-w-[19%] lg:min-w-[32%] sm:min-w-[50%]
        xs:min-w-[60%] min-w-[73%]">
          <p className=" !font-semibold sm:text-2xl text-xl">Bench </p>
          <p className=" text-white !font-semibold sm:text-2xl text-xl">
            {currentText}
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`message ${
            messageType === "success" ? "bg-green-500" : "bg-red-500"
          } p-2 mb-1 text-white text-center`}
        >
          {message}
        </div>
      )}
      <FilterResources setSearchBarValue={setSearchBarValue} />

      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 m-6">
        {debouncedSearchBarValue.length === 0
          ? showResources?.map((resource) => (
              <div
                key={resource?._id}
                className="flex flex-col justify-between gap-2 text-white text-center sm:p-8 p-3 bg-blue-400 rounded-lg"
              >
                <p>Type: {resource.type}</p>
                <p>Description: {resource.description}</p>
                <p>Available Stock Count: {resource.count}</p>
                <select
                  value={selectedCounts[resource._id] || ""}
                  onChange={(e) =>
                    handleSelectChange(resource._id, e.target.value)
                  }
                  className="border rounded p-2 text-black"
                >
                  <option value="" disabled>
                    Select count
                  </option>
                  {[...Array(resource.count).keys()].map((i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={() =>
                    handleBookResource(
                      resource._id,
                      selectedCounts[resource._id]
                    )
                  }
                  disabled={!selectedCounts[resource._id]}
                  //className="flex gap-2"
                >
                  {" "}
                  {selectedCounts[resource._id] && isBooking ? (
                    <div className="flex gap-2">
                      <Loader /> Booking...
                    </div>
                  ) : (
                    <div>Book for ME</div>
                  )}
                </Button>
              </div>
            ))
          : debouncedSearchBarValue.length > 0 &&
            filteredResources.length > 0 &&
            filteredResources.map((resource) => (
              <div
                key={resource?._id}
                className="flex flex-col justify-between gap-2 text-white text-center sm:p-8 p-3 bg-blue-400 rounded-lg"
              >
                <p>Type: {resource.type}</p>
                <p>Description: {resource.description}</p>
                <p>Available Stock Count: {resource.count}</p>
                <select
                  value={selectedCounts[resource._id] || ""}
                  onChange={(e) =>
                    handleSelectChange(resource._id, e.target.value)
                  }
                  className="border rounded p-2 text-black"
                >
                  <option value="" disabled>
                    Select count
                  </option>
                  {[...Array(resource.count).keys()].map((i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={() =>
                    handleBookResource(
                      resource._id,
                      selectedCounts[resource._id]
                    )
                  }
                  disabled={!selectedCounts[resource._id]}
                  //className="flex gap-2"
                >
                  {" "}
                  {selectedCounts[resource._id] && isBooking ? (
                    <div className="flex gap-2">
                      <Loader /> Booking...
                    </div>
                  ) : (
                    <div>Book for ME</div>
                  )}
                </Button>
              </div>
            ))}
      </div>
      <ToBecomeAdminForm />
    </div>
  );
}
export default HomePage;
