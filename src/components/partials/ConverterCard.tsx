"use client";

import { useUtcTimeContext } from "@/context/UtcTimeContextProvider";
import { Point } from "geojson";
import { useEffect, useState } from "react";

type TimezoneInformation = {
	date: {
		dateString?: string;
		day: number;
		month: number;
		year: number;
	};
	time: {
		timeString?: string;
		hour: number;
		minute: number;
		seconds?: number;
	};
	timezone: string;
	countryCode: string;
	utcOffsetSeconds: number;
	isHoliday: number | 200 | 204 | 400 | 404;
};

type GeoInformation = {
	latitude: number;
	longitude: number;
	countryCode: string;
};

const validateInput = (input: string): string | null => {
	const trimmedInput = input.trim();
	if (!trimmedInput || /[^a-zA-Z0-9\s,]/.test(trimmedInput)) {
		return null;
	}
	return trimmedInput;
};

const calculateMinuteOffset = (utcOffsetSeconds: number, time: number): number => {
	if (utcOffsetSeconds % 3600 == 1800) {
		return (30 + time) % 60;
	} else if (utcOffsetSeconds % 3600 == 2700) {
		return (45 + time) % 60;
	} else {
		return (0 + time) % 60;
	}
};

const padDateTime = (time: number): string => {
	return time.toString().padStart(2, "0");
};

const ConverterCard = () => {
	const [search, setSearch] = useState("");
	const [geoInformation, setGeoInformation] = useState<GeoInformation>();

	const [currentTime, setCurrentTime] = useState<TimezoneInformation>();
	const [timezoneIncrements, setTimezoneIncrements] = useState<TimezoneInformation[]>();
	const { utcHour, utcMinutes, utcSeconds } = useUtcTimeContext();

	useEffect(() => {
		fetchTimezoneFromCoordinates();
	}, [geoInformation, utcHour]);

	useEffect(() => {
		if (!currentTime) return;

		const minuteOffsetted = calculateMinuteOffset(currentTime.utcOffsetSeconds, utcMinutes);
		const timeFormatted = `${padDateTime(currentTime.time.hour)}:${padDateTime(minuteOffsetted)}:${padDateTime(
			utcSeconds
		)}`;

		setCurrentTime({
			...currentTime,
			time: {
				...currentTime.time,
				timeString: timeFormatted,
				minute: minuteOffsetted,
				seconds: utcSeconds,
			},
		});
	}, [utcMinutes, utcSeconds]);

	const handleSubmit = async () => {
		const validatedSearch = validateInput(search);
		if (!validatedSearch) {
			alert("Enter a valid location!");
			return;
		}

		try {
			const searchResult = await fetch(
				`https://photon.komoot.io/api/?q=${search}&lang=en&limit=1&layer=country&layer=state&layer=county&layer=city`
			).then((res) => res.json());

			const geometry: Point = searchResult.features[0].geometry as Point;
			const property = searchResult.features[0].properties;

			if (property && geometry) {
				setGeoInformation({
					latitude: geometry.coordinates[1],
					longitude: geometry.coordinates[0],
					countryCode: property.countrycode,
				});

				if (property.type === "city" || property.type === "county" || property.type === "state") {
					if (property.state) {
						setSearch(`${property.name}, ${property.state}, ${property.country}`);
					} else {
						setSearch(`${property.name}, ${property.country}`);
					}
				} else {
					setSearch(`${property.country}`);
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	const fetchTimezoneFromCoordinates = async () => {
		if (!geoInformation) return;

		try {
			const timeData = await fetch(
				`https://timeapi.io/api/time/current/coordinate?latitude=${geoInformation.latitude}&longitude=${geoInformation.longitude}`
			).then((res) => res.json());

			const holidayData = await fetch(
				`https://date.nager.at/api/v3/isTodayPublicHoliday/${geoInformation.countryCode}`
			).then((res) => {
				return res.status;
			});

			const timezoneData = await fetch(
				`https://timeapi.io/api/timezone/coordinate?latitude=${geoInformation.latitude}&longitude=${geoInformation.longitude}`
			).then((res) => res.json());

			const dateFormatted = `${padDateTime(timeData.day)}-${padDateTime(timeData.month)}-${timeData.year}`;

			const initialCurrentTime: TimezoneInformation = {
				date: { dateString: dateFormatted, day: timeData.day, month: timeData.month, year: timeData.year },
				time: { hour: timeData.hour, minute: timeData.minute },
				timezone: timezoneData.timeZone,
				utcOffsetSeconds: timezoneData.currentUtcOffset.seconds,
				countryCode: geoInformation.countryCode,
				isHoliday: holidayData,
			};

			setCurrentTime({
				...initialCurrentTime,
			});

			fetchTimezoneIncrements(initialCurrentTime);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchTimezoneIncrements = async (timeData: TimezoneInformation) => {
		console.log("fetchTimezoneIncrements called");
		if (!timeData) return;

		const initialTimezoneIncrements: TimezoneInformation[] = [];

		let currentConvert: TimezoneInformation = {
			...timeData,
			time: { hour: timeData.time.hour, minute: calculateMinuteOffset(timeData.utcOffsetSeconds, utcMinutes) },
		};

		for (let i = 1; i <= 24; i++) {
			if (currentConvert.time.hour === 23) {
				const paddedHour = padDateTime(currentConvert.time.hour);
				const paddedDay = padDateTime(currentConvert.date.day);
				const paddedMonth = padDateTime(currentConvert.date.month);
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
					const dateFormatted = `${padDateTime(calculationResult.day)}-${padDateTime(calculationResult.month)}-${
						calculationResult.year
					}`;
					currentConvert = {
						...currentConvert,
						date: {
							dateString: dateFormatted,
							day: calculationResult.day,
							month: calculationResult.month,
							year: calculationResult.year,
						},
						time: {
							timeString: calculationResult.time, // already padded
							hour: calculationResult.hour,
							minute: calculationResult.minute,
						},
						isHoliday: isHoliday,
					};
				} catch (err) {
					console.log("API request failed", err);
				}
			} else {
				currentConvert = {
					...currentConvert,
					time: {
						...currentConvert.time,
						timeString: `${padDateTime(currentConvert.time.hour + 1)}:00`,
						hour: (currentConvert.time.hour + 1) % 24,
					},
				};
			}
			initialTimezoneIncrements.push(currentConvert);
		}
		setTimezoneIncrements(initialTimezoneIncrements);
	};

	return (
		<div className="flex flex-row space-x-4">
			{/* card component begins here. */}
			<div className="flex flex-col space-y-2">
				<input
					type="text"
					className="border-2 border-black"
					value={search}
					name="search"
					onChange={(e) => setSearch(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleSubmit();
						}
					}}
				/>

				<div className="flex flex-col border-2 p-4">
					<p>{currentTime?.date.dateString}</p>
					<p>{currentTime?.time.timeString}</p>
				</div>

				<ul className="flex flex-col space-y-2">
					{timezoneIncrements?.map((item, index) => (
						<li key={index} className="flex flex-col border-2 p-4">
							<p>{item.date.dateString}</p>
							<p>{item.time.timeString}</p>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default ConverterCard;
