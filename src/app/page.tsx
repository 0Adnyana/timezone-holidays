"use client";

import ConvertTimezoneForm, { ICountryHolidays } from "@/components/partials/ConvertTimezoneForm";
import RenderHoliday from "@/components/partials/RenderHoliday";
import { useState, useEffect } from "react";

export default function Home() {
	const [countryHolidays, setCountryHolidays] = useState<ICountryHolidays[] | null>(null);

	useEffect(() => {
		console.log(countryHolidays);
	}, [countryHolidays]);

	const handleChildData = (data: ICountryHolidays[] | null) => {
		setCountryHolidays(data);
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="flex flex-col">
				<ConvertTimezoneForm onSendData={handleChildData}></ConvertTimezoneForm>
				<RenderHoliday countryHolidays={countryHolidays}></RenderHoliday>
			</div>
		</main>
	);
}
