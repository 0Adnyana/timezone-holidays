import { ICountryHolidays } from "./ConvertTimezoneForm";

type RenderHolidayProps = {
	countryHolidays: ICountryHolidays[] | null;
};

const RenderHoliday = (props: RenderHolidayProps) => {
	return (
		<ul>
			{props.countryHolidays?.map((holiday: any, index: number) => (
				<li key={index}>
					<div className="flex flex-row space-x-4">
						<p>{holiday.date}</p>
						<p>{holiday.localName}</p>
						<p>{holiday.name}</p>
						{holiday.counties != null ? (
							<ul>
								{holiday.counties?.map((county: any, index: number) => (
									<li key={index}>{county}</li>
								))}
							</ul>
						) : null}
						<ul>
							{holiday.types.map((type: string, index: number) => (
								<li key={index}>{type}</li>
							))}
						</ul>
					</div>
				</li>
			))}
		</ul>
	);
};

export default RenderHoliday;
