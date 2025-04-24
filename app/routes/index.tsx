import { Home } from "@/pages/home";
import type { Route } from "@rr/types/app/routes/+types/index";
export function meta(_: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Index() {
	return <Home />;
}
