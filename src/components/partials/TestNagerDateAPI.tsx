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

const TestNagerDateAPI = () => {
	const [countryToCode, setCountryToCode] = useState("");
	const [countryHolidays, setCountryHolidays] = useState<ICountryHolidays[]>();

	const handleSubmit = () => {
		console.log("country: ", countryToCode);

		if (countryToCode == "") {
			console.log("select a valid input!");
		} else {
			fetch(`https://date.nager.at/api/v3/NextPublicHolidays/${countryToCode}`)
				.then((res) => res.json())
				.then((res) => setCountryHolidays(res));
		}
	};

	return (
		<>
			<div>
				<h2>Get Holiday! (Nager.Dates API)</h2>
				<div className="flex flex-row space-x-2">
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
				<ul>
					{countryHolidays?.map((holiday: any, index: number) => (
						<li key={index}>
							<div className="flex flex-row space-x-4">
								<p>{holiday.date}</p>
								<p>{holiday.localName}</p>
								<p>{holiday.name}</p>
								{holiday.counties != null ? (
									<ul>
										{holiday.counties?.map((county: any, index: number) => (
											<li key={index}>{county}</li>
										))}
									</ul>
								) : null}
								<ul>
									{holiday.types.map((type: string, index: number) => (
										<li key={index}>{type}</li>
									))}
								</ul>
							</div>
						</li>
					))}
				</ul>
			</div>
		</>
	);
};

export default TestNagerDateAPI;
