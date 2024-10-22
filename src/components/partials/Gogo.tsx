"use client";
import { useGeoInformationContext } from "@/context/CoordinatesContextProvider";
import { GlobalTimeContext, useGlobalTimeContext } from "@/context/GlobalTimeContextProvider";
import React, { useContext } from "react";

const Gogo = () => {
	const { globalTime } = useGlobalTimeContext();

	return (
		<div>
			<p>{globalTime}</p>
		</div>
	);
};

export default Gogo;
