import HomeRecentWork from "./HomeRecentWork/HomeRecentWork";
import HomeEntrance from "./HomeEntrance/HomeEntrance";
import HomeAbout from "./HomeAbout/HomeAbout";
import HomeProject from "./HomeProject/HomeProject";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
const Home = ({ entranceAnimationDone, handleButtonNavigation }) => {
	return (
		<>
			{/* <HomeEntrance
				entranceAnimationDone={entranceAnimationDone}
			></HomeEntrance> */}
			{entranceAnimationDone && (
				<>
					{/* <HomeAbout></HomeAbout> */}
					<HomeRecentWork></HomeRecentWork>
					{/* <HomeProject></HomeProject> */}
					<div className="h-[200vh] pt-20 bg-light-dark text-primary px-5 pb-50 ">
						<div className="flex flex-row justify-between mb-5">
							<div className="text-5xl font-bold">WRITING</div>
							<div className="">
								{/* <PrimaryButton label={"VIEW ALL"}></PrimaryButton> */}
							</div>
						</div>
						<div data-name="view" className="group mb-10">
							<div className="my-3 pointer-events-none overflow-hidden max-h-[35vh]">
								<img
									className="group-hover:scale-105 transition-all duration-500 ease-initial"
									src="https://framerusercontent.com/images/Z6qmtAxjwbIurGFL0Iboo0hQnJw.jpg?scale-down-to=512"
									alt=""
								/>
							</div>
							<div data-name="view" className="text-2xl font-bold">
								GFX100RF: The midlife crisis camera
							</div>
							<div
								data-name="view"
								className="text-color-text-hovering  text-sm font-bold"
							>
								APR 5, 2025
							</div>
						</div>
						<div data-name="view" className="group mb-10 ">
							<div className="my-3 pointer-events-none overflow-hidden max-h-[35vh]">
								<img
									className="group-hover:scale-105 transition-all duration-500 ease-initial"
									src="https://framerusercontent.com/images/ivYYFXUUWUo6JjgupgzZtcLoQw.jpg"
									alt=""
								/>
							</div>
							<div data-name="view" className="text-2xl font-bold">
								Predicting the Fixed Lens GFX
							</div>
							<div
								data-name="view"
								className="text-color-text-hovering  text-sm font-bold"
							>
								May 13, 2024
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default Home;
