"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type GlobalTimeContextProviderProps = {
	children: React.ReactNode;
};

type GlobalTimeContextType = {
	globalTime: string;
};

export const GlobalTimeContext = createContext<GlobalTimeContextType | null>(null);

const GlobalTimeContextProvider = ({ children }: GlobalTimeContextProviderProps) => {
	const [globalTime, setGlobalTime] = useState<string>("");

	useEffect(() => {
		const timer = setInterval(() => setGlobalTime(new Date().toUTCString()), 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<GlobalTimeContext.Provider
			value={{
				globalTime,
			}}
		>
			{children}
		</GlobalTimeContext.Provider>
	);
};

export default GlobalTimeContextProvider;

export function useGlobalTimeContext() {
	const context = useContext(GlobalTimeContext);
	if (!context) {
		throw new Error("useGlobalTimeContext must be used within a GlobalTimeContextProvider");
	}

	return context;
}
