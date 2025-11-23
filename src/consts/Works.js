import galadinerlgsm from "../assets/img/profiles/galadinerlgsm.JPEG";
import lg1 from "../assets/img/profiles/lg1.jpeg";
import lg2 from "../assets/img/profiles/lg2.jpeg";
import mattel from "../assets/img/profiles/mattel.jpg";
import mattel1 from "../assets/img/profiles/mattel1.jpeg";
import mattel2 from "../assets/img/profiles/mattel2.jpeg";
import dpr from "../assets/img/profiles/dpr.JPEG";
import dpr1 from "../assets/img/profiles/dpr1.jpeg";
import dpr2 from "../assets/img/profiles/dpr2.jpeg";

const Works = [
	{
		id: 1,
		company: "LG Sinar Mas",
		role: "Software Engineer",
		desc: "Since December 2024, I've been working as a Software Engineer at LG Sinar Mas Technology Solutions, where I contribute to the development of smart factory systems for EV (Electric Vehicle) battery manufacturing across multiple countries.",
		startDate: "Dec 2024",
		endDate: "Present",
		img: galadinerlgsm,
		points: [
			"Contributed to the development of smart factory systems for EV battery manufacturing across multiple countries such as South Korea, the United States, China, Poland, and Indonesia.",
			"Designed and maintained backend logic to support core MES (Manufacturing Execution System) operations, ensuring seamless and accurate production workflows.",
			"Analyze production data and validate backend features to ensure performance, reliability, and data accuracy.",
			"Developed job portal and job posting applications for LG Sinarmas Technology Solutions to streamline recruitment processes.",
		],
		iamges: [lg1, lg2],
		bgColor: "bg-neutral-800",
		url: "",
	},
	// Developed and maintained backend logic modules using Java and BizActor to support core MES operations across factories in multiple countries.
	// •
	// Utilized SQL Server Management Studio (SSMS) to analyze production data and validate backend feature requests for performance and accuracy.
	// •
	// Collaborated with QA and manufacturing teams to maintain and scale backend services across production lines.
	{
		id: 2,
		company: "PT. \u00A0Mattel Indonesia",
		role: "Full Stack Developer",
		desc: "From January to December 2024, I worked as a Full Stack Developer at Mattel Indonesia for 1 year, focusing on building internal systems and improving operational efficiency.",
		startDate: "Jan 2024",
		endDate: "Dec 2024",
		img: mattel,
		points: [
			"I led the digital transformation of manual processes by developing systems like Audit Process, Reporting, Waste Management, Compliance Monitoring, Incident Reporting, and Inventory Management using ASP.NET, Power Apps, and SQL Server.",
			"Maintained and managed databases with SQL Server and visualized data through Power BI; used Power Automate and Gateway for streamlined workflows and secure access.",
			"Recognized as a semi-finalist (Top 8) in the Global Manufacturing Internship Competition for innovative and impactful contributions.",
			"Collaborated with cross-functional teams to turn business requirements into efficient technical solutions, receiving praise for innovation and problem-solving.",
		],
		iamges: [mattel2, mattel1],
		bgColor: "bg-neutral-400",
		url: "",
	},
	{
		id: 3,
		company: "Sekretariat Jendral DPR RI",
		role: "IT Programmer",
		desc: "Interned at Sekretariat Jendral DPR RI for 5 months through the Kampus Merdeka program, working on data visualization tools and system architecture for legal data management.",
		startDate: "Aug 2023",
		endDate: "Dec 2023",
		img: dpr,
		points: [
			"Developed a data visualization dashboard similar to Tableau/Power BI using Laravel and SQL, allowing users to create customizable charts and layouts for personalized analysis.",
			"Built an efficient data scheduler with Node.js that periodically pulls optimized datasets from the main database, significantly improving load times and performance.",
			"Designed the improvement system of the 'Dashboard Website Program Legislasi Nasional DPR', including architecture planning, use case diagrams, activity diagrams, and ERDs to improve legal data management and website accountability.",
		],
		iamges: [dpr1, dpr2],
		bgColor: "bg-zinc-700",
		url: "",
	},
];
export default Works;
