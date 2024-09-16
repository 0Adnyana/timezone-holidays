"use client";

import { useGeoInformationContext } from "@/context/CoordinatesContextProvider";
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
	countryCode: string;
	isHoliday: number | 200 | 204 | 400 | 404;
}

const RenderTimezone = () => {
	const { geoInformations, setGeoInformations } = useGeoInformationContext();
	const [timezoneInformations, settimezoneInformations] = useState<TimezoneInformation[]>();
	const [timezoneIncrements, setTimezoneIncrements] = useState<TimezoneInformation[][]>(); // [timezone index][increment]

	useEffect(() => {
		fetchTimezoneFromCoordinates();
	}, [geoInformations]);

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
		if (geoInformations) {
			try {
				const rawTimezoneData = await Promise.all(
					geoInformations.map((geoInformation) => {
						return fetch(
							`https://timeapi.io/api/time/current/coordinate?latitude=${geoInformation.latitude}&longitude=${geoInformation.longitude}`
						).then((res) => res.json());
					})
				);

				const holidayData = await Promise.all(
					geoInformations.map((geoInformation) => {
						return fetch(`https://date.nager.at/api/v3/isTodayPublicHoliday/${geoInformation.countryCode}`).then(
							(res) => {
								return res.status;
							}
						);
					})
				);

				const initialtimezoneInformations: TimezoneInformation[] = rawTimezoneData.map((rawData, index) => {
					return {
						date: { day: rawData.day, month: rawData.month, year: rawData.year },
						time: { hour: rawData.hour, minute: rawData.minute },
						timezone: rawData.timeZone,
						countryCode: geoInformations[index].countryCode,
						isHoliday: holidayData[index],
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

						const isHoliday = await fetch(
							`https://date.nager.at/api/v3/isTodayPublicHoliday/${currentConvert.countryCode}`
						).then((res) => {
							return res.status;
						});

						const calculationResult = data.calculationResult;

						currentConvert = {
							...currentConvert,
							date: { day: calculationResult.day, month: calculationResult.month, year: calculationResult.year },
							time: { hour: calculationResult.hour, minute: calculationResult.minute },
							isHoliday: isHoliday,
						};
					} catch (err) {
						console.log("API request failed", err);
					}
				} else {
					currentConvert = {
						...currentConvert,
						time: { hour: (currentConvert.time.hour + 1) % 24, minute: 0 },
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
