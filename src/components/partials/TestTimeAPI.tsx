"use client";

import { useEffect, useState } from "react";

interface ITimezoneInformation {
	date: string;
	time: string;
	timezone: string;
}

const TestTimeAPI = () => {
	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [responseFrom, setResponseFrom] = useState<ITimezoneInformation>();
	const [timezoneFrom, setTimezoneFrom] = useState("");
	const [responseTo, setResponseTo] = useState<ITimezoneInformation>();
	const [timezoneTo, setTimezoneTo] = useState("");

	useEffect(() => {
		console.log("responseFrom = ", responseFrom);
		if (responseFrom) {
			setTimezoneFrom(responseFrom.timezone);
		}
	}, [responseFrom]);

	useEffect(() => {
		console.log("timezoneFrom = ", timezoneFrom);
	}, [timezoneFrom]);

	const handleSubmit = () => {
		fetch(`https://timeapi.io/api/time/current/coordinate?latitude=${latitude}&longitude=${longitude}`)
			.then((res) => res.json())
			.then((res) => {
				setResponseFrom({ date: res.date, time: res.time, timezone: res.timeZone });
			});
	};

	return (
		<>
			<div className="flex flex-row space-x-2">
				<input
					type="number"
					className="border-2 border-black"
					value={latitude}
					name="latitude"
					onChange={(e) => setLatitude(e.target.valueAsNumber)}
				/>
				<input
					type="number"
					className="border-2 border-black"
					value={longitude}
					name="longitude"
					onChange={(e) => setLongitude(e.target.valueAsNumber)}
				/>
				<button onClick={() => handleSubmit()} className="border-2 border-black p-2">
					Submit
				</button>
			</div>
		</>
	);
};

export default TestTimeAPI;
