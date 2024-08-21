"use client";

import { useEffect, useState } from "react";

interface CountryDropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

interface ICountry {
	countryCode: string;
	name: string;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({ children, ...props }) => {
	const [data, setData] = useState<ICountry[] | null>(null);

	useEffect(() => {
		fetch("https://date.nager.at/api/v3/AvailableCountries")
			.then((res) => res.json())
			.then((res) => setData(res));
	}, []);

	return (
		<select {...props} className="border-2 border-black p-1">
			<option value="" disabled>
				Select country
			</option>
			{data?.map((item: any, index: number) => (
				<option key={index} value={item.countryCode}>
					{item.name}
				</option>
			))}
		</select>
	);
};

export default CountryDropdown;
