"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type UtcTimeContextProviderProps = {
	children: React.ReactNode;
};

type UtcTimeContextType = {
	utcTime: string;
	utcHour: number;
	utcMinutes: number;
	utcSeconds: number;
};

export const UtcTimeContext = createContext<UtcTimeContextType | null>(null);

const UtcTimeContextProvider = ({ children }: UtcTimeContextProviderProps) => {
	const [utcTime, setUtcTime] = useState<string>("");
	const [utcHour, setUtcHour] = useState<number>(0);
	const [utcMinutes, setUtcMinutes] = useState<number>(0);
	const [utcSeconds, setUtcSeconds] = useState<number>(0);

	const getUtcTime = () => {
		const now = new Date();
		const currentUtcTime = new Intl.DateTimeFormat("en-GB", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
			timeZone: "UTC",
		}).format(now);

		const currentUtcHour = now.getUTCHours();
		const currentUtcMinute = now.getUTCMinutes();
		const currentUtcSeconds = now.getUTCSeconds();

		return {
			currentUtcTime,
			currentUtcHour,
			currentUtcMinute,
			currentUtcSeconds,
		};
	};

	useEffect(() => {
		const timeNow = setInterval(() => {
			const { currentUtcTime, currentUtcHour, currentUtcMinute, currentUtcSeconds } = getUtcTime();
			setUtcTime(currentUtcTime);

			setUtcHour((prevHour) => {
				if (prevHour !== currentUtcHour) {
					return currentUtcHour;
				}
				return prevHour;
			});

			setUtcMinutes((prevMinutes) => {
				if (prevMinutes !== currentUtcMinute) {
					return currentUtcMinute;
				}
				return prevMinutes;
			});

			setUtcSeconds((prevSeconds) => {
				if (prevSeconds !== currentUtcSeconds) {
					return currentUtcSeconds;
				}
				return prevSeconds;
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
				utcMinutes,
				utcSeconds,
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
