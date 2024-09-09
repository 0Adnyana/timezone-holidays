"use client";

import { useEffect, useState } from "react";
import { FeatureCollection } from "geojson";

interface GeoCoordinates {
	latitutde: number;
	longitude: number;
}

const TestPhotonAPI = () => {
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState<FeatureCollection>();
	const [geoCoordinates, setGeoCoordinates] = useState<GeoCoordinates>();
	const [generalLocation, setGeneralLocation] = useState("");

	useEffect(() => {
		console.log(searchResult);
		if (searchResult) {
			const geometry = searchResult.features[0]?.geometry;
			if (geometry?.type === "Point") {
				setGeoCoordinates({
					longitude: geometry.coordinates[0],
					latitutde: geometry.coordinates[1],
				});
			}

			const properties = searchResult.features[0]?.properties;
			if (properties) {
				if (properties.type == "city" || properties.type == "county") {
					if (properties.state == undefined) {
						setGeneralLocation(`${properties.name}, ${properties.country}`);
					} else {
						setGeneralLocation(`${properties.name}, ${properties.state}, ${properties.country}`);
					}
				} else {
					if (properties.state == undefined) {
						setGeneralLocation(`${properties.country}`);
					} else {
						setGeneralLocation(`${properties.city}, ${properties.state}, ${properties.country}`);
					}
				}
			}
		}
	}, [searchResult]);

	useEffect(() => {
		setSearch(generalLocation);
	}, [generalLocation]);

	const handleSubmit = () => {
		fetch(`https://photon.komoot.io/api/?q=${search}&lang=en&limit=1&layer=country&layer=state&layer=county&layer=city`)
			.then((res) => res.json())
			.then((res) => {
				setSearchResult(res);
			})
			.catch((err) => console.log(err));
	};

	return (
		<>
			<div>
				<h2>Search country to get Geo Coordinates! (Photon API)</h2>
				<div className="flex flex-row space-x-2">
					<input
						type="text"
						className="border-2 border-black"
						value={search}
						name="search"
						onChange={(e) => setSearch(e.target.value)}
					/>
					<button onClick={() => handleSubmit()} className="border-2 border-black p-2">
						Submit
					</button>
				</div>
				<p className="pt-2">
					Latitude: {geoCoordinates != null ? geoCoordinates.latitutde : "null"}, Longitude:{" "}
					{geoCoordinates != null ? geoCoordinates.longitude : "null"}
				</p>
			</div>
		</>
	);
};

export default TestPhotonAPI;
