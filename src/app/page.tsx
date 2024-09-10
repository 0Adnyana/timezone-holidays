import ConvertTimezone from "@/components/partials/ConvertTimezoneForm";
import RenderTimezone from "@/components/partials/RenderTimezone";
import TestNagerDateAPI from "@/components/partials/TestNagerDateAPI";
import TestPhotonAPI from "@/components/partials/TestPhotonAPI";
import TestTimeAPI from "@/components/partials/TestTimeAPI";
import CoordinatesContextProvider from "@/context/CoordinatesContextProvider";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="flex flex-col space-y-4">
				<CoordinatesContextProvider>
					<ConvertTimezone></ConvertTimezone>
					<RenderTimezone></RenderTimezone>
				</CoordinatesContextProvider>
			</div>
		</main>
	);
}
