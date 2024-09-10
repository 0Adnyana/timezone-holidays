"use client";
import React, { createContext, useContext, useState } from "react";

type CoordinatesContextProviderProps = {
	children: React.ReactNode;
};

export type GeoCoordinate = {
	latitude: number;
	longitude: number;
};

type GeoCoordinates = GeoCoordinate[] | null;

type CoordinatesContext = {
	geoCoordinates: GeoCoordinates;
	setGeoCoordinates: React.Dispatch<React.SetStateAction<GeoCoordinates>>;
};

export const CoordinatesContext = createContext<CoordinatesContext | null>(null);

const CoordinatesContextProvider = ({ children }: CoordinatesContextProviderProps) => {
	const [geoCoordinates, setGeoCoordinates] = useState<GeoCoordinates>(null);

	return (
		<CoordinatesContext.Provider
			value={{
				geoCoordinates,
				setGeoCoordinates,
			}}
		>
			{children}
		</CoordinatesContext.Provider>
	);
};

export default CoordinatesContextProvider;

export function useCoordinatesContext() {
	const context = useContext(CoordinatesContext);
	if (!context) {
		throw new Error("useCoordinatesContext must be used within a CoordinatesContextProvider");
	}

	return context;
}
