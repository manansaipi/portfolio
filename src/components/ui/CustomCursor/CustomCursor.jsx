import { useCustomCursor } from "./useCustomCursor";

export default function CustomCursor() {
	const { position, hovering, hoveringImage, shouldHide } = useCustomCursor();

	return (
		<div
			className={`bg-cursor fixed pointer-events-none h-5 translate-z-100 mix-blend-difference rounded-full z-9999 -translate-x-1/2 -translate-y-1/2
				${hovering ? " scale-230" : ""}
				${hoveringImage ? "scale-200 w-10" : "w-5"}
				${shouldHide ? "hidden" : ""}
				transition-transform duration-450`}
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
			}}
		>
			{hoveringImage && (
				<div className="w-full h-full text-[10px] font-semibold flex items-center justify-center">
					VIEW
				</div>
			)}
		</div>
	);
}
