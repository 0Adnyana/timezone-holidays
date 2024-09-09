import ConvertTimezone from "@/components/partials/ConvertTimezoneForm";
import TestNagerDateAPI from "@/components/partials/TestNagerDateAPI";
import TestPhotonAPI from "@/components/partials/TestPhotonAPI";
import TestTimeAPI from "@/components/partials/TestTimeAPI";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="flex flex-col space-y-4">
				<ConvertTimezone></ConvertTimezone>
			</div>
		</main>
	);
}
