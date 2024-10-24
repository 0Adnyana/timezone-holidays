import ConverterCard from "@/components/partials/ConverterCard";
import GlobalTimeCard from "@/components/partials/GlobalTimeCard";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center p-24">
			<div className="flex flex-col space-y-2">
				<GlobalTimeCard></GlobalTimeCard>
				<div className="flex flex-row space-x-2">
					<ConverterCard></ConverterCard>
					<ConverterCard></ConverterCard>
					<ConverterCard></ConverterCard>
				</div>
			</div>
		</main>
	);
}
