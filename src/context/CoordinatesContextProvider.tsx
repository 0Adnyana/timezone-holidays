"use client";
import React, { createContext, useContext, useState } from "react";

type GeoInformationContextProviderProps = {
	children: React.ReactNode;
};

export type CountryCode = {
	countryCode: string;
};

export type GeoCoordinate = {
	latitude: number;
	longitude: number;
};

export type GeoInformation = GeoCoordinate & CountryCode;

export type GeoInformations = GeoInformation[] | null;

type CoordinatesContext = {
	geoInformations: GeoInformations;
	setGeoInformations: React.Dispatch<React.SetStateAction<GeoInformations>>;
};

export const GeoInformationContext = createContext<CoordinatesContext | null>(null);

const GeoInformationContextProvider = ({ children }: GeoInformationContextProviderProps) => {
	const [geoInformations, setGeoInformations] = useState<GeoInformations>(null);

	return (
		<GeoInformationContext.Provider
			value={{
				geoInformations,
				setGeoInformations,
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
