"use client";

import { useEffect, useState } from "react";

interface TimezoneConversionData {
	convertFrom: TimezoneInformation;
	convertTo: TimezoneInformation;
}

interface TimezoneInformation {
	date: string;
	time: string;
	timezone: string;
}

interface GeoCoordinate {
	latitude: number;
	longitude: number;
}

const TestTimeAPI = () => {
	const [coordinateTo, setCoordinateTo] = useState<GeoCoordinate>({ latitude: 0, longitude: 0 });
	const [coordinateFrom, setCoordinateFrom] = useState<GeoCoordinate>({ latitude: 0, longitude: 0 });
	// for future updates, timezone information should use arrays instead of objects. When using arrays, the 0th index is the convertFrom, and the i-th index is the convertTo.
	const [timezoneInformation, setTimezoneInformation] = useState<TimezoneConversionData>();

	useEffect(() => {
		console.log(timezoneInformation);
	}, [timezoneInformation]);

	const handleSubmit = () => {
		fetchTimezoneFromCoordinates();
	};

	const fetchTimezoneFromCoordinates = async () => {
		if (coordinateTo && coordinateFrom) {
			try {
				const responses = await Promise.all([
					fetch(
						`https://timeapi.io/api/time/current/coordinate?latitude=${coordinateFrom.latitude}&longitude=${coordinateFrom.longitude}`
					),
					fetch(
						`https://timeapi.io/api/time/current/coordinate?latitude=${coordinateTo.latitude}&longitude=${coordinateTo.longitude}`
					),
				]);

				const rawData = await Promise.all(responses.map((response) => response.json()));

				// if timezoneInformation uses array, use rawData.map to add objects instead of hard-coding.
				const dataTo: TimezoneInformation = {
					date: rawData[0].date,
					time: rawData[0].time,
					timezone: rawData[0].timeZone,
				};
				const dataFrom: TimezoneInformation = {
					date: rawData[1].date,
					time: rawData[1].time,
					timezone: rawData[1].timeZone,
				};
				setTimezoneInformation({ convertFrom: dataTo, convertTo: dataFrom });
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<>
			<div className="flex flex-row space-x-2">
				<input
					type="number"
					className="border-2 border-black"
					value={coordinateFrom?.latitude}
					name="latitude"
					onChange={(e) =>
						setCoordinateFrom((prevState) => ({
							...prevState,
							latitude: e.target.valueAsNumber,
						}))
					}
				/>
				<input
					type="number"
					className="border-2 border-black"
					value={coordinateFrom?.longitude}
					name="longitude"
					onChange={(e) =>
						setCoordinateFrom((prevState) => ({
							...prevState,
							longitude: e.target.valueAsNumber,
						}))
					}
				/>
				<p>break</p>
				<input
					type="number"
					className="border-2 border-black"
					value={coordinateTo?.latitude}
					name="latitude"
					onChange={(e) =>
						setCoordinateTo((prevState) => ({
							...prevState,
							latitude: e.target.valueAsNumber,
						}))
					}
				/>
				<input
					type="number"
					className="border-2 border-black"
					value={coordinateTo?.longitude}
					name="longitude"
					onChange={(e) =>
						setCoordinateTo((prevState) => ({
							...prevState,
							longitude: e.target.valueAsNumber,
						}))
					}
				/>
				<button onClick={() => handleSubmit()} className="border-2 border-black p-2">
					Submit
				</button>
			</div>
		</>
	);
};

export default TestTimeAPI;
