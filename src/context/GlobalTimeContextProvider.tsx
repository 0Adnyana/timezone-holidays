"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type UtcTimeContextProviderProps = {
	children: React.ReactNode;
};

type UtcTimeContextType = {
	utcTime: string;
	utcHour: string;
};

export const UtcTimeContext = createContext<UtcTimeContextType | null>(null);

const UtcTimeContextProvider = ({ children }: UtcTimeContextProviderProps) => {
	const [utcTime, setUtcTime] = useState<string>("");
	const [utcHour, setUtcHour] = useState<string>("");

	const getUtcTime = () => {
		const now = new Date();
		const currentUtcTime = new Intl.DateTimeFormat("en-GB", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
			timeZone: "UTC",
		}).format(now);

		const currentUtcHour = now.getUTCHours().toString().padStart(2, "0");

		return {
			currentUtcTime,
			currentUtcHour,
		};
	};

	useEffect(() => {
		const timeNow = setInterval(() => {
			const { currentUtcTime, currentUtcHour } = getUtcTime();
			setUtcTime(currentUtcTime);

			setUtcHour((prevHour) => {
				if (prevHour !== currentUtcHour) {
					console.log(`Hour changed to: ${currentUtcHour}`);

					return currentUtcHour;
				}
				return prevHour;
			});
		}, 1000);

		return () => {
			clearInterval(timeNow);
		};
	}, []);

	return (
		<UtcTimeContext.Provider
			value={{
				utcTime,
				utcHour,
			}}
		>
			{children}
		</UtcTimeContext.Provider>
	);
};

export default UtcTimeContextProvider;

export function useUtcTimeContext() {
	const context = useContext(UtcTimeContext);
	if (!context) {
		throw new Error("useUtcTimeContext must be used within a UtcTimeContextProvider");
	}

	return context;
}
