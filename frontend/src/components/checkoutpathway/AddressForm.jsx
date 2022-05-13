import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "../../utils/useForm";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/actions/cartActions";
import { useEffect } from "react";

const AddressForm = ({
  fillWithPreSavedAddress,
  setFormData2PreSaved,
  toggleAddressForm,
  formDataPreSaved,
  setMessage,
  hideReturnOption,
}) => {
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

  useEffect(() => {
    setFormData2({
      ...formData,
      phone: formDataPreSaved.phone,
      email: formDataPreSaved.email,
    });
  }, [formDataPreSaved, formData, setFormData2]);

  const { shippingAddress } = useSelector((state) => state.cart);
  useEffect(() => {
    if (fillWithPreSavedAddress && shippingAddress) {
      setFormData2(shippingAddress);
      setFormData2PreSaved(shippingAddress);
    }
  }, [fillWithPreSavedAddress]);
  const submitHandler = (e) => {
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
      setMessage(`Please add: ${missingEntries}`);
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
  return (
    <form
      className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
      onSubmit={submitHandler}>
      <div>
        <label
          htmlFor="firstName"
          className="block text-sm font-medium text-gray-700">
          First name
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={setFormData}
            className="block w-full p-1 bg-blue-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="lastName"
          className="block text-sm font-medium text-gray-700">
          Last name
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={setFormData}
            className="block w-full p-1 bg-blue-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="company"
          className="block text-sm font-medium text-gray-700">
          Company
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="company"
            id="company"
            value={formData.company}
            onChange={setFormData}
            className="block w-full p-1 bg-blue-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="streetAddress"
          className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="streetAddress"
            id="streetAddress"
            value={formData.streetAddress}
            onChange={setFormData}
            className="block w-full p-1 bg-blue-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="apartment"
          className="block text-sm font-medium text-gray-700">
          Apartment, suite, etc.
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="apartment"
            id="apartment"
            value={formData.apartment}
            onChange={setFormData}
            className="block w-full p-1 bg-blue-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="city"
          className="block text-sm font-medium text-gray-700">
          City
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="city"
            id="city"
            value={formData.city}
            onChange={setFormData}
            className="block w-full p-1 bg-blue-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="country"
          className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <div className="mt-1">
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={setFormData}
            className="block w-full p-1 bg-blue-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option>United States</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="state"
          className="block text-sm font-medium text-gray-700">
          State / Province
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="state"
            id="state"
            value={formData.state}
            onChange={setFormData}
            className="block w-full p-1 bg-blue-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="postalCode"
          className="block text-sm font-medium text-gray-700">
          Postal code
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="postalCode"
            id="postalCode"
            value={formData.postalCode}
            onChange={setFormData}
            className="block w-full p-1 bg-blue-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex gap-5 w-full items-center">
        <button
          onClick={submitHandler}
          type="submit"
          className=" bg-black text-white border border-transparent rounded-md shadow-sm py-2 px-5 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-500">
          Continue
        </button>
        {!hideReturnOption && (
          <span
            onClick={toggleAddressForm}
            className=" hover:font-bold cursor-pointer">
            Use previously saved address
          </span>
        )}
      </div>
    </form>
  );
};

export default AddressForm;
