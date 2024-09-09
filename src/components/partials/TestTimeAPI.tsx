"use client";

import { useEffect, useState } from "react";

interface TimezoneConversionData {
	convertFrom: TimezoneInformation;
	convertTo: TimezoneInformation;
}

interface TimezoneInformation {
	date: {
		day: number;
		month: number;
		year: number;
	};
	time: {
		hour: number;
		minute: number;
	};
	timezone: string;
}

interface GeoCoordinates {
	latitude: number;
	longitude: number;
}

const TestTimeAPI = () => {
	const [coordinateFrom, setCoordinateFrom] = useState<GeoCoordinates>({ latitude: 35.6821936, longitude: 139.762221 });
	const [coordinateTo, setCoordinateTo] = useState<GeoCoordinates>({ latitude: -8.6524973, longitude: 115.2191175 });
	// for future updates, timezone information should use arrays instead of objects. When using arrays, the 0th index is the convertFrom, and the i-th index is the convertTo.
	const [timezoneInformation, setTimezoneInformation] = useState<TimezoneConversionData>();
	const [timezoneIncrements, setTimezoneIncrements] = useState<TimezoneConversionData[]>();

	useEffect(() => {
		console.log(timezoneIncrements);
	}, [timezoneIncrements]);

	const handleSubmit = () => {
		fetchTimezoneFromCoordinates();
		fetchTimezoneIncrements();
	};

	const fetchTimezoneIncrements = async () => {
		if (!timezoneInformation) return;

		const initialData: TimezoneConversionData[] = [
			{
				...timezoneInformation,
			},
		];

		let currentConvertFrom: TimezoneInformation = {
			...timezoneInformation.convertFrom,
			time: { hour: timezoneInformation.convertFrom.time.hour, minute: 0 },
		};
		let currentConvertTo: TimezoneInformation = {
			...timezoneInformation.convertTo,
			time: { hour: timezoneInformation.convertTo.time.hour, minute: 0 },
		};

		for (let i = 1; i <= 24; i++) {
			if (currentConvertFrom.time.hour === 23 || currentConvertTo.time.hour === 23) {
				const paddedHourFrom = currentConvertFrom.time.hour.toString().padStart(2, "0");
				const paddedMonthFrom = currentConvertFrom.date.month.toString().padStart(2, "0");
				const paddedDayFrom = currentConvertFrom.date.day.toString().padStart(2, "0");
				const paddedHourTo = currentConvertTo.time.hour.toString().padStart(2, "0");
				const paddedMonthTo = currentConvertTo.date.month.toString().padStart(2, "0");
				const paddedDayTo = currentConvertTo.date.day.toString().padStart(2, "0");

				const dateTimeFrom = `${currentConvertFrom.date.year}-${paddedMonthFrom}-${paddedDayFrom} ${paddedHourFrom}:00:00`;
				const dateTimeTo = `${currentConvertTo.date.year}-${paddedMonthTo}-${paddedDayTo} ${paddedHourTo}:00:00`;

				try {
					const responses = await Promise.all([
						fetch("https://timeapi.io/api/calculation/custom/increment", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								timeZone: currentConvertFrom.timezone,
								timeSpan: "00:01:00:00",
								dateTime: dateTimeFrom,
								dstAmbiguity: "",
							}),
						}),
						fetch("https://timeapi.io/api/calculation/custom/increment", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								timeZone: currentConvertTo.timezone,
								timeSpan: "00:01:00:00",
								dateTime: dateTimeTo,
								dstAmbiguity: "",
							}),
						}),
					]);

					const rawData = await Promise.all(responses.map((response) => response.json()));
					const data = await Promise.all(rawData.map((response) => response.calculationResult));
					if (rawData[0] && rawData[1]) {
						currentConvertFrom = {
							date: { day: data[0].day, month: data[0].month, year: data[0].year },
							time: { hour: data[0].hour, minute: data[0].minute },
							timezone: rawData[0].timeZone,
						};
						currentConvertTo = {
							date: { day: data[1].day, month: data[1].month, year: data[1].year },
							time: { hour: data[1].hour, minute: data[1].minute },
							timezone: rawData[1].timeZone,
						};
					} else {
						console.error("Unexpected API response structure", rawData);
						break;
					}
				} catch (err) {
					console.error("API request failed", err);
					break;
				}
			} else {
				currentConvertFrom = {
					...timezoneInformation.convertFrom,
					time: { hour: (timezoneInformation.convertFrom.time.hour + i) % 24, minute: 0 },
				};
				currentConvertTo = {
					...timezoneInformation.convertTo,
					time: { hour: (timezoneInformation.convertTo.time.hour + i) % 24, minute: 0 },
				};
			}

			initialData.push({
				convertFrom: { ...currentConvertFrom },
				convertTo: { ...currentConvertTo },
			});
		}

		setTimezoneIncrements(initialData);
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
					date: { day: rawData[0].day, month: rawData[0].month, year: rawData[0].year },
					time: { hour: rawData[0].hour, minute: rawData[0].minute },
					timezone: rawData[0].timeZone,
				};
				const dataFrom: TimezoneInformation = {
					date: { day: rawData[1].day, month: rawData[1].month, year: rawData[1].year },
					time: { hour: rawData[1].hour, minute: rawData[1].minute },
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
					Convert
				</button>
			</div>
			<div className="flex flex-row space-x-4">
				<p>
					{timezoneInformation?.convertFrom.date.day}/{timezoneInformation?.convertFrom.date.month}/
					{timezoneInformation?.convertFrom.date.year} {timezoneInformation?.convertFrom.time.hour}:
					{timezoneInformation?.convertFrom.time.minute}
				</p>
				<div className="border-l-2 border-black"></div>
				<p>
					{timezoneInformation?.convertTo.date.day}/{timezoneInformation?.convertTo.date.month}/
					{timezoneInformation?.convertTo.date.year} {timezoneInformation?.convertTo.time.hour}:
					{timezoneInformation?.convertTo.time.minute}
				</p>
			</div>
		</>
	);
};

export default TestTimeAPI;
