"use client";

import { useCoordinatesContext } from "@/context/CoordinatesContextProvider";
import { useEffect, useState } from "react";

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

const RenderTimezone = () => {
	const { geoCoordinates, setGeoCoordinates } = useCoordinatesContext();
	const [timezoneInformations, settimezoneInformations] = useState<TimezoneInformation[]>();
	const [timezoneIncrements, setTimezoneIncrements] = useState<TimezoneInformation[][]>(); // [timezone index][increment]

	useEffect(() => {
		fetchTimezoneFromCoordinates();
	}, [geoCoordinates]);

	useEffect(() => {
		console.log(timezoneInformations);
		if (timezoneInformations && timezoneInformations.length > 0) {
			fetchTimezoneIncrements();
		}
	}, [timezoneInformations]);

	useEffect(() => {
		console.log(timezoneIncrements);
	}, [timezoneIncrements]);

	const fetchTimezoneFromCoordinates = async () => {
		if (geoCoordinates) {
			try {
				const rawDatas = await Promise.all(
					geoCoordinates.map((geoCoordinate) => {
						return fetch(
							`https://timeapi.io/api/time/current/coordinate?latitude=${geoCoordinate.latitude}&longitude=${geoCoordinate.longitude}`
						).then((res) => res.json());
					})
				);

				const initialtimezoneInformations: TimezoneInformation[] = rawDatas.map((rawData) => {
					return {
						date: { day: rawData.day, month: rawData.month, year: rawData.year },
						time: { hour: rawData.hour, minute: rawData.minute },
						timezone: rawData.timeZone,
					};
				});
				settimezoneInformations(initialtimezoneInformations);
			} catch (err) {
				console.log(err);
			}
		}
	};

	const fetchTimezoneIncrements = async () => {
		if (!timezoneInformations) return;

		const initialTimezoneIncrements: TimezoneInformation[][] = [];

		for (const timezoneInformation of timezoneInformations) {
			const initialData: TimezoneInformation[] = [];

			let currentConvert: TimezoneInformation = {
				...timezoneInformation,
				time: { hour: timezoneInformation.time.hour, minute: 0 },
			};

			for (let i = 1; i <= 24; i++) {
				if (currentConvert.time.hour === 23) {
					const paddedHour = currentConvert.time.hour.toString().padStart(2, "0");
					const paddedDay = currentConvert.date.day.toString().padStart(2, "0");
					const paddedMonth = currentConvert.date.month.toString().padStart(2, "0");
					const dateTimeFormatted = `${currentConvert.date.year}-${paddedMonth}-${paddedDay} ${paddedHour}:00:00`;

					try {
						const data = await fetch("https://timeapi.io/api/calculation/custom/increment", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								timeZone: currentConvert.timezone,
								timeSpan: "00:01:00:00",
								dateTime: dateTimeFormatted,
								dstAmbiguity: "",
							}),
						}).then((res) => res.json());

						const calculationResult = data.calculationResult;

						currentConvert = {
							date: { day: calculationResult.day, month: calculationResult.month, year: calculationResult.year },
							time: { hour: calculationResult.hour, minute: calculationResult.minute },
							timezone: data.timeZone,
						};
					} catch (err) {
						console.log("API request failed", err);
					}
				} else {
					currentConvert = {
						...timezoneInformation,
						time: { hour: (timezoneInformation.time.hour + i) % 24, minute: 0 },
					};
				}
				initialData.push(currentConvert);
			}
			initialTimezoneIncrements.push(initialData);
		}
		setTimezoneIncrements(initialTimezoneIncrements);
	};

	return <div>RenderTimezone</div>;
};

export default RenderTimezone;
