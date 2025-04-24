import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";

function generateSampleData(count: number, startId = 1) {
	return Array.from({ length: count }, (_, index) => ({
		id: startId + index,
	}));
}

export function Home() {
	const [sampleData, setSampleData] = useState(() => generateSampleData(1));
	const [isOpen, setIsOpen] = useState(false);
	const [drawerHeight, setDrawerHeight] = useState(25);
	const drawerRef = useRef<HTMLDivElement>(null);
	const isDragging = useRef(false);

	const snapPoints = [25, 50, 75, 95];

	const handleDrag = (clientY: number) => {
		if (!drawerRef.current || !isDragging.current) return;

		const drawerRect = drawerRef.current.getBoundingClientRect();
		const windowHeight = window.innerHeight;
		const drawerBottom = windowHeight - drawerRect.top;
		const newHeight = (windowHeight / drawerBottom) * 10;

		const snappedHeight = snapPoints.reduce((prev, curr) =>
			Math.abs(curr - newHeight) < Math.abs(prev - newHeight) ? curr : prev,
		);

		setDrawerHeight(Math.max(25, Math.min(95, snappedHeight)));
	};

	const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
		isDragging.current = true;
		const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
		handleDrag(clientY);

		const handleMouseMove = (e: MouseEvent) => handleDrag(e.clientY);
		const handleTouchMove = (e: TouchEvent) => handleDrag(e.touches[0].clientY);

		const endDrag = () => {
			isDragging.current = false;
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("mouseup", endDrag);
			document.removeEventListener("touchend", endDrag);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("touchmove", handleTouchMove);
		document.addEventListener("mouseup", endDrag);
		document.addEventListener("touchend", endDrag);
	};

	const addData = () => {
		const newData = generateSampleData(1, sampleData.length + 1);
		setSampleData((prevData) => [...prevData, ...newData]);
	};

	const rmData = () => {
		setSampleData((prevData) => prevData.slice(0, -1));
	};

	useEffect(() => {
		if (isOpen) {
			setDrawerHeight(25);
		}
	}, [isOpen]);

	return (
		<>
			<Button
				onClick={addData}
				className="btn top-4 right-4 bg-green-500 hover:bg-green-600 text-white"
			>
				+
			</Button>
			<Button
				onClick={rmData}
				className="btn top-4 right-4 bg-green-500 hover:bg-green-600 text-white"
			>
				-
			</Button>
			<Drawer open={isOpen} onOpenChange={setIsOpen}>
				<DrawerTrigger asChild>
					<Button className="fixed bottom-4 right-4">Open User List</Button>
				</DrawerTrigger>
				<DrawerContent className="p-0">
					<div
						ref={drawerRef}
						className="flex flex-col bg-white rounded-t-xl shadow-lg transition-all duration-300 ease-in-out overflow-hidden"
						style={{ height: `${drawerHeight}vh` }}
					>
						<div
							className="h-6 w-full cursor-ns-resize flex items-center justify-center"
							onMouseDown={startDrag}
							onTouchStart={startDrag}
						>
							<div className="h-1.5 w-12 bg-gray-300 rounded-full" />
						</div>
						<DrawerHeader>
							<DrawerTitle>User List ({sampleData.length} users)</DrawerTitle>
						</DrawerHeader>
						<div className="flex-1 p-4 overflow-auto">
							<Table>
								<TableHeader>
									<TableRow className="bg-gray-100">
										<TableHead className="font-semibold text-gray-700 sticky top-0 bg-gray-100 z-10">
											ID
										</TableHead>
										<TableHead className="font-semibold text-gray-700 sticky top-0 bg-gray-100 z-10">
											Action
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{sampleData.map((user) => (
										<TableRow key={user.id} className="hover:bg-gray-50">
											<TableCell className="font-medium text-gray-900">
												{user.id}
											</TableCell>
											<TableCell>
												<Button
													onClick={() => console.log(`Edit user ${user.id}`)}
													size="sm"
													className="bg-blue-500 hover:bg-blue-600 text-white"
												>
													Edit
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>
				</DrawerContent>
			</Drawer>
		</>
	);
}
