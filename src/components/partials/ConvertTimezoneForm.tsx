"use client";

import { useEffect, useState } from "react";
import { FeatureCollection, Point } from "geojson";
import { GeoCoordinate } from "@/context/CoordinatesContextProvider";

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

const validateInput = (input: string): string | null => {
	const trimmedInput = input.trim();
	if (!trimmedInput || /[^a-zA-Z0-9\s,]/.test(trimmedInput)) {
		return null;
	}
	return trimmedInput;
};

const ConvertTimezoneForm = () => {
	const [search, setSearch] = useState(["", ""]);
	const [geoCoordinates, setGeoCoordinates] = useState<GeoCoordinate[] | null>(null);

	const [timezoneInformation, setTimezoneInformation] = useState<TimezoneInformation[]>();
	const [timezoneIncrements, setTimezoneIncrements] = useState<TimezoneInformation[][]>();

	useEffect(() => {
		console.log(geoCoordinates);
	}, [geoCoordinates]);

	const handleInputChange = (index: number, value: string) => {
		setSearch((prev) => {
			const newSearch = [...prev];
			newSearch[index] = value;
			return newSearch;
		});
	};

	const handleSubmit = async () => {
		const validatedSearch = search.map(validateInput);
		if (validatedSearch.includes(null)) {
			alert("Please enter valid location names without special characters.");
			return;
		}

		try {
			const searchResults = await Promise.all(
				validatedSearch.map((s) =>
					fetch(
						`https://photon.komoot.io/api/?q=${s}&lang=en&limit=1&layer=country&layer=state&layer=county&layer=city`
					).then((res) => res.json())
				)
			);

			const geometries: Point[] = await Promise.all(
				searchResults.map((searchResult) => searchResult.features[0]?.geometry)
			).then((results) => results.filter((result): result is Point => result?.type === "Point"));

			const initialGeoCoordinates: GeoCoordinate[] = geometries.map((geometry) => {
				return { latitude: geometry.coordinates[1], longitude: geometry.coordinates[0] };
			});

			setGeoCoordinates(initialGeoCoordinates);

			const properties = searchResults.map((searchResult) => searchResult.features[0]?.properties);
			const location: string[] = [];

			properties.forEach((property) => {
				if (property) {
					if (property.type === "city" || property.type === "county" || property.type === "state") {
						if (property.state) {
							location.push(`${property.name}, ${property.state}, ${property.country}`);
						} else {
							location.push(`${property.name}, ${property.country}`);
						}
					} else {
						location.push(`${property.country}`);
					}
				}
			});
			setSearch(location);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<h1>Convert Timezone!</h1>
			<div className="flex flex-row space-x-2">
				<input
					type="text"
					className="border-2 border-black"
					value={search[0]}
					name="search0"
					onChange={(e) => handleInputChange(0, e.target.value)}
				/>
				<input
					type="text"
					className="border-2 border-black"
					value={search[1] || ""}
					name="search1"
					onChange={(e) => handleInputChange(1, e.target.value)}
				/>

				<button onClick={() => handleSubmit()} className="border-2 border-black p-2">
					Submit
				</button>
			</div>
		</>
	);
};

export default ConvertTimezoneForm;
