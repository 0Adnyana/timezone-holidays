"use client";

import { Point } from "geojson";
import { useEffect, useState } from "react";

type TimezoneInformation = {
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

const ConverterCard = () => {
	const [search, setSearch] = useState("");
	const [geoInformation, setGeoInformation] = useState<GeoInformation>();
	const [currentTime, setCurrentTime] = useState<TimezoneInformation>();
	const [timezoneIncrements, setTimezoneIncrements] = useState<TimezoneInformation[]>();

	useEffect(() => {
		console.log(geoInformation);
		fetchTimezoneFromCoordinates();
	}, [geoInformation]);

	useEffect(() => {
		console.log(currentTime);
		fetchTimezoneIncrements();
	}, [currentTime]);

	useEffect(() => {
		console.log(timezoneIncrements);
	}, [timezoneIncrements]);

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
			// let location: string = "";

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

			setCurrentTime({
				date: { day: timeData.day, month: timeData.month, year: timeData.year },
				time: { hour: timeData.hour, minute: timeData.minute },
				timezone: timezoneData.timeZone,
				utcOffsetSeconds: timezoneData.currentUtcOffset.seconds,
				countryCode: geoInformation.countryCode,
				isHoliday: holidayData,
			});
		} catch (err) {
			console.log(err);
		}
	};

	const fetchTimezoneIncrements = async () => {
		if (!currentTime) return;

		const initialTimezoneIncrements: TimezoneInformation[] = [];

		let minuteOffset; // for currentConvert -> India, Iran, and more have 30 minute offsets, Nepal has 45.
		if (currentTime.utcOffsetSeconds % 3600 == 1800) {
			minuteOffset = 30;
		} else if (currentTime.utcOffsetSeconds % 3600 == 2700) {
			minuteOffset = 45;
		} else {
			minuteOffset = 0;
		}

		let currentConvert: TimezoneInformation = {
			...currentTime,
			time: { hour: currentTime.time.hour, minute: minuteOffset },
		};

		for (let i = 1; i <= 24; i++) {
			if (currentConvert.time.hour === 23) {
				const paddedMinute = currentConvert.time.minute.toString().padStart(2, "0");
				const paddedHour = currentConvert.time.hour.toString().padStart(2, "0");
				const paddedDay = currentConvert.date.day.toString().padStart(2, "0");
				const paddedMonth = currentConvert.date.month.toString().padStart(2, "0");
				const dateTimeFormatted = `${currentConvert.date.year}-${paddedMonth}-${paddedDay} ${paddedHour}:${paddedMinute}:00`;

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
					time: { ...currentConvert.time, hour: (currentConvert.time.hour + 1) % 24 },
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
					<p>
						{currentTime?.date.day.toString().padStart(2, "0")}-{currentTime?.date.month.toString().padStart(2, "0")}-
						{currentTime?.date.year}
					</p>
					<p>
						{currentTime?.time.hour.toString().padStart(2, "0")}:{currentTime?.time.minute.toString().padStart(2, "0")}
					</p>
				</div>

				<ul className="flex flex-col space-y-2">
					{timezoneIncrements?.map((item, index) => (
						<li key={index} className="flex flex-col border-2 p-4">
							<p>
								{item.date.day.toString().padStart(2, "0")}-{item.date.month.toString().padStart(2, "0")}-
								{item.date.year}
							</p>
							<p>
								{item.time.hour.toString().padStart(2, "0")}:{item.time.minute.toString().padStart(2, "0")}
							</p>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default ConverterCard;
