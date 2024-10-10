import ConverterCard from "@/components/partials/ConverterCard";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="flex flex-row space-x-2">
				<ConverterCard></ConverterCard>
				<ConverterCard></ConverterCard>
				<ConverterCard></ConverterCard>
			</div>
		</main>
	);
}
