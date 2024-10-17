"use client";

import { useEffect, useState } from "react";
import { Point } from "geojson";
import { useGeoInformationContext, GeoInformation, GeoInformations } from "@/context/CoordinatesContextProvider";

const validateInput = (input: string): string | null => {
	const trimmedInput = input.trim();
	if (!trimmedInput || /[^a-zA-Z0-9\s,]/.test(trimmedInput)) {
		return null;
	}
	return trimmedInput;
};

const ConvertTimezoneForm = () => {
	const [search, setSearch] = useState(["", ""]);
	const { geoInformations, setGeoInformations } = useGeoInformationContext();

	useEffect(() => {
		console.log(geoInformations);
	}, [geoInformations]);

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
			alert("Enter a valid location!");
			return;
		}

		try {
			const searchResults = await Promise.all(
				validatedSearch.map((search) =>
					fetch(
						`https://photon.komoot.io/api/?q=${search}&lang=en&limit=1&layer=country&layer=state&layer=county&layer=city`
					).then((res) => res.json())
				)
			);

			const geometries: Point[] = await Promise.all(
				searchResults.map((searchResult) => searchResult.features[0]?.geometry)
			).then((results) => results.filter((result): result is Point => result?.type === "Point"));

			const initialGeoInformations: GeoInformations = [];
			const location: string[] = [];

			searchResults.forEach((searchResult, index) => {
				const property = searchResult.features[0]?.properties;
				const geometry = geometries[index];

				if (property && geometry) {
					const geoInfo: GeoInformation = {
						latitude: geometry.coordinates[1],
						longitude: geometry.coordinates[0],
						countryCode: property.countrycode,
					};

					initialGeoInformations.push(geoInfo);

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

			setGeoInformations(initialGeoInformations);
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
