"use client";
import { useGeoInformationContext } from "@/context/CoordinatesContextProvider";
import { useUtcTimeContext } from "@/context/GlobalTimeContextProvider";
import React, { useContext } from "react";

const Gogo = () => {
	const { utcTime, utcHour, utcMinutes, utcSeconds } = useUtcTimeContext();

	return (
		<div>
			<p>Global Time: {utcTime}</p>
			<p>Global Hour: {utcHour}</p>
			<p>Global Minutes: {utcMinutes}</p>
			<p>Global Seconds: {utcSeconds}</p>
		</div>
	);
};

export default Gogo;
