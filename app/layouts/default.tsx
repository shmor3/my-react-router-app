import { Container } from "@/components/container";
import { Outlet } from "react-router";

export default function Default() {
	return (
		<main>
			<Container size="lg">
				<div className="mt-12">
					<Outlet />
				</div>
			</Container>
		</main>
	);
}
