"use client";

import { useState } from "react";

interface ITestNominatimAPI {}

const TestNominatimAPI = () => {
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [country, setCountry] = useState("");

	const handleSubmit = () => {
		console.log(city, state, country);
		fetch(
			`https://nominatim.openstreetmap.org/search?city=${city}&state=${state}&country=${country}&addressdetails=1&limit=1&format=jsonv2`
		)
			.then((res) => res.json())
			.then((res) => console.log(res))
			.catch((err) => console.log(err));
	};
	return (
		<>
			<div className="flex flex-row space-x-2">
				<input
					type="text"
					className="border-2 border-black"
					value={city}
					name="city"
					onChange={(e) => setCity(e.target.value)}
				/>
				<input
					type="text"
					className="border-2 border-black"
					value={state}
					name="state"
					onChange={(e) => setState(e.target.value)}
				/>
				<input
					type="text"
					className="border-2 border-black"
					value={country}
					name="country"
					onChange={(e) => setCountry(e.target.value)}
				/>
				<button onClick={() => handleSubmit()} className="border-2 border-black p-2">
					Submit
				</button>
			</div>
		</>
	);
};

export default TestNominatimAPI;
