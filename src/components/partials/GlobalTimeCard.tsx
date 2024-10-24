"use client";
import { useUtcTimeContext } from "@/context/UtcTimeContextProvider";
import React from "react";

const GlobalTimeCard = () => {
	const { utcTime } = useUtcTimeContext();

	return (
		<div className="flex w-full border-2 border-black items-center justify-center py-5">
			<h1 className="text-2xl">Current UTC Time: {utcTime}</h1>
		</div>
	);
};

export default GlobalTimeCard;
