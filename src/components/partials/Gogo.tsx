"use client";
import { useGeoInformationContext } from "@/context/CoordinatesContextProvider";
import { useUtcTimeContext } from "@/context/GlobalTimeContextProvider";
import React, { useContext } from "react";

const Gogo = () => {
	const { utcTime, utcHour } = useUtcTimeContext();

	return (
		<div>
			<p>Global Time: {utcTime}</p>
			<p>Global Hour: {utcHour}</p>
		</div>
	);
};

export default Gogo;
