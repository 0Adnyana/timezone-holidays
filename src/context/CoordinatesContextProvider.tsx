"use client";
import React, { createContext, useContext, useState } from "react";

type GeoInformationContextProviderProps = {
	children: React.ReactNode;
};

export type GeoCoordinate = {
	latitude: number;
	longitude: number;
};

export type CountryCode = {
	countryCode: string;
};

type GeoCoordinates = GeoCoordinate[] | null;
type CountryCodes = CountryCode[] | null;

type CoordinatesContext = {
	geoCoordinates: GeoCoordinates;
	setGeoCoordinates: React.Dispatch<React.SetStateAction<GeoCoordinates>>;
	countryCodes: CountryCodes;
	setCountryCodes: React.Dispatch<React.SetStateAction<CountryCodes>>;
};

export const GeoInformationContext = createContext<CoordinatesContext | null>(null);

const GeoInformationContextProvider = ({ children }: GeoInformationContextProviderProps) => {
	const [geoCoordinates, setGeoCoordinates] = useState<GeoCoordinates>(null);
	const [countryCodes, setCountryCodes] = useState<CountryCodes>(null);

	return (
		<GeoInformationContext.Provider
			value={{
				geoCoordinates,
				setGeoCoordinates,
				countryCodes,
				setCountryCodes,
			}}
		>
			{children}
		</GeoInformationContext.Provider>
	);
};

export default GeoInformationContextProvider;

export function useGeoInformationContext() {
	const context = useContext(GeoInformationContext);
	if (!context) {
		throw new Error("useGeoInformationContext must be used within a GeoInformationContextProvider");
	}

	return context;
}
