import AboutEntrance from "@pages/About/components/AboutEntrance/AboutEntrance";
import Certificate from "@pages/About/components/AboutCertificate/AboutCertificate";

const About = () => {
	return (
		<div className=" bg-light-dark text-primary pt-[20vh] overflow-x-hidden">
			<AboutEntrance />
			<Certificate />
		</div>
	);
};

export default About;
