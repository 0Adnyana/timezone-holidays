"use client";

import { useState } from "react";
import CountryDropdown from "../ui/CountryDropdown";

export interface ICountryHolidays {
	date: string;
	localName: string;
	name: string;
	countryCode: string;
	fixed: boolean;
	global: boolean;
	counties: string[] | null;
	launchYear: number | null;
	types: string[];
}

type ConvertTimezoneFormProps = {
	onSendData: (data: ICountryHolidays[] | null) => void;
};

const ConvertTimezoneForm: React.FC<ConvertTimezoneFormProps> = ({ onSendData }) => {
	const [countryFromCode, setCountryFromCode] = useState("");
	const [countryToCode, setCountryToCode] = useState("");

	const handleSubmit = () => {
		console.log("country from: ", countryFromCode, " country to: ", countryToCode);

		if (countryToCode == "") {
			console.log("select a valid input!");
		} else {
			fetch(`https://date.nager.at/api/v3/NextPublicHolidays/${countryToCode}`).then((res) =>
				res.json().then((res) => onSendData(res))
			);
		}
	};

	return (
		<div className="flex flex-row space-x-2">
			<CountryDropdown
				name="countryFrom"
				id="countryFrom"
				value={countryFromCode}
				onChange={(e) => setCountryFromCode(e.target.value)}
			/>
			<CountryDropdown
				name="countryTo"
				id="countryTo"
				value={countryToCode}
				onChange={(e) => setCountryToCode(e.target.value)}
			/>

			<button onClick={() => handleSubmit()} className="border-2 border-black">
				Submit
			</button>
		</div>
	);
};

export default ConvertTimezoneForm;
