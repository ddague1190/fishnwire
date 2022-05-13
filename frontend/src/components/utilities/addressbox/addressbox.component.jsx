import React from "react";
import "./addressbox.styles.scss";

const AddressBox = ({
  index,
  input,
  highlighted,
  selectedAddress,
  className,
  disabled,
}) => {
  if (!input) return "";

  const {
    firstName,
    lastName,
    company,
    streetAddress,
    apartment,
    city,
    state,
    postalCode
  } = input;

  return (
    <address className={`${className} ${
      highlighted ? "addressbox--highlighted" : ""
    } addressbox`}
    onClick={!disabled ? () => selectedAddress(input, index) : null}>
          {firstName} {lastName} <br/>
        {company && <>{company}<br/></>}
        {streetAddress}<br/>
        {apartment && <>{apartment}<br/></>}
          {city}, {state} {postalCode}<br/>
        USA
    </address>
  );
};

export default AddressBox;
