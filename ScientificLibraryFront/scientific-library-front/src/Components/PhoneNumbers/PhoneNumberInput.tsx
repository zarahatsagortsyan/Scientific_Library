import React from "react";
import './PhoneNumberInput.css'
interface PhoneNumberInputProps {
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneNumberChange: (number: string) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
}) => {
  const countryCodes = [
    "+1",
    "+44",
    "+91",
    "+33",
    "+49",
    "+61",
    "+81",
    "+55",
    "+34",
    "+7",
  ]; // Array of country codes

  return (
    <div className="phone-number-input">
      <div className="phone-input-wrapper">
        <select
          value={countryCode}
          onChange={(e) => onCountryCodeChange(e.target.value)}
          className="country-code-select"
        >
          {countryCodes.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          className="phone-number-input-field"
          placeholder="Enter phone number"
        />
      </div>
    </div>
  );
};

export default PhoneNumberInput;
