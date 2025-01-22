import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../components/utilities/CheckoutSteps";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../redux/actions/cartActions";
import {
  getSavedAddresses,
  getUserDetails,
} from "../redux/actions/userActions";
import AddressBox from "../components/utilities/addressbox/addressbox.component";
import Message from "../components/utilities/Message";
import { useForm } from "../utils/useForm";
import AddressForm from "../components/checkoutpathway/AddressForm";
import { PlusSmIcon as PlusSmIconSolid } from "@heroicons/react/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ShippingScreen() {
  const [addEmailPhone, setAddEmailPhone] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData, setFormData2] = useForm({
    firstName: "",
    lastName: "",
    company: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    email: "",
  });

  const [whichHighlighted, setWhichHighlighted] = useState(
    new Array(10).fill(false)
  );
  const [addNewAddress, setAddNewAddress] = useState(false);
  const { addresses } = useSelector((state) => state.savedAddresses);
  const { user } = useSelector((state) => state.userDetails);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(getSavedAddresses());
    dispatch(getUserDetails());
  }, []);

  const selectedAddress = (selected, index) => {
    const tempFormData = formData;
    setFormData2({
      ...selected,
      email: formData.email || "",
      phone: formData.phone || "",
    });
    setWhichHighlighted(
      whichHighlighted.map((el, id) => (id === index ? true : false))
    );
    setMessage("");
  };

  const submitHandlerForPreSavedAddresses = (e) => {
    e.preventDefault();
    const missingEntries = [];
    Object.keys(formData).forEach((key) => {
      if (
        key != "phone" &&
        key != "email" &&
        key != "company" &&
        key != "apartment"
      ) {
        if (!formData[key]) {
          missingEntries.push(key.toLowerCase());
        }
      }
    });

    if (missingEntries.length > 0) {
      setMessage(`Missing information: ${missingEntries}`);
      return false;
    }

    if (!formData.firstName) {
      setMessage("Please select address or add a new one");
      return false;
    }
    setMessage("");

    dispatch(
      saveShippingAddress({
        ...formData,
      })
    );
    dispatch(savePaymentMethod("PayPal or Credit Card"));
    navigate("/placeorder");
  };

  const toggleAddressForm = () => {
    setAddNewAddress(!addNewAddress);
    setWhichHighlighted(new Array(10).fill(false));
  };

  const oldAddresses = addresses?.map((el, index) => (
    <AddressBox
      className="col-span-1 cursor-pointer bg-green-50 w-max px-2 rounded-md py-3"
      key={index}
      index={index}
      input={el}
      selectedAddress={selectedAddress}
      highlighted={whichHighlighted[index]}></AddressBox>
  ));

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-xl pt-10 pb-24 px-4 lg:px-8">
        {message && <Message>{message}</Message>}
        <CheckoutSteps step1="complete" step2="current" />
        <h1 className="text-3xl mt-16 mb-10 font-extrabold w-full tracking-tight text-gray-900 sm:text-4xl">
          Shipping
        </h1>
        <div className="">
          <div className="lg:grid  lg:gap-x-12 xl:gap-x-16">
            <div>
              <div>
                <div className="flex flex-row items-center gap-3">
                  <h2 className="text-lg font-medium text-gray-900">
                    Add contact information
                  </h2>
                  <button
                    type="button"
                    onClick={() => setAddEmailPhone(!addEmailPhone)}
                    className="inline-flex font-semibold items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <PlusSmIconSolid className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
                <span className="text-xs block p-2 mt-2 bg-green-50 w-max rounded-md">
                  (We already have your primary email: {user?.email})
                </span>

                {addEmailPhone && (
                  <>
                    <div className="mt-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700">
                        Add an additional email to recieve updates (optional):
                      </label>

                      <div className="mt-1">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          autoComplete="email"
                          value={formData.email}
                          onChange={setFormData}
                          className="block w-full p-1 bg-blue-50 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="email-address"
                        className="block text-sm font-medium text-gray-700">
                        Add a phone number (optional):
                      </label>
                      <div className="mt-1">
                        <input
                          type="phone"
                          id="phone"
                          name="phone"
                          autoComplete="email"
                          value={formData.phone}
                          onChange={setFormData}
                          className="block w-full p-1 border-gray-300 bg-blue-50 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="my-3 text-lg font-medium text-gray-900">
                  Shipping information
                </h2>

                {addresses ? (
                  !addNewAddress ? (
                    <div className="">
                      <p className="font-light text-medium text-gray-500 mb-8">
                        Select from previously saved addresses:
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 w-full">{oldAddresses}</div>
                      <div className="mt-8 flex flex-row gap-5 w-96 items-center">
                        <button
                          onClick={submitHandlerForPreSavedAddresses}
                          type="submit"
                          className=" bg-black text-white border border-transparent rounded-md shadow-sm py-2 px-5 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-500">
                          Continue
                        </button>

                        <span
                          onClick={toggleAddressForm}
                          className=" hover:font-bold cursor-pointer">
                          Send to a different address
                        </span>
                      </div>
                    </div>
                  ) : (
                    <AddressForm
                      setMessage={setMessage}
                      toggleAddressForm={toggleAddressForm}
                      formDataPreSaved={formData}
                    />
                  )
                ) : (
                  <AddressForm
                    hideReturnOption
                    fillWithPreSavedAddress
                    setMessage={setMessage}
                    formDataPreSaved={formData}
                    setFormData2PreSaved={setFormData2}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
