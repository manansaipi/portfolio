import galadinerlgsm from "../../../assets/img/profiles/galadinerlgsm.JPEG";
import mattel from "../../../assets/img/profiles/mattel.jpg";
import dpr from "../../../assets/img/profiles/dpr.JPEG";

const Works = [
    {
        id: 1,
        company: "LG Sinar Mas",
        role: "Software Engineer",
        desc: "Since December 2024, I've been working as a Software Engineer at LG Sinar Mas Technology Solutions, where I contribute to the development of smart factory systems for EV (Electric Vehicle) battery manufacturing across multiple countries.",
        startDate: "Dec 2024",
        endDate: "Present",
        img: galadinerlgsm,
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
        desc: "Worked on building internal systems to help automate processes like audits, reports, incident tracking, and inventory using ASP.NET, Power Apps, and SQL Server. Helped improve workflow efficiency with Power Automate and created reports using Power BI. Reached the Top 8 in the Global Manufacturing Internship Competition for impactful project contributions.",
        startDate: "Jan 2024",
        endDate: "Dec 2024",
        img: mattel,
        bgColor: "bg-neutral-400",
        url: "",
    },
    {
        id: 3,
        company: "Sekretariat Jendral DPR RI",
        role: "IT Programmer",
        desc: "Built a dashboard app using Laravel and SQL that works like Tableau or Power BI, letting users create custom charts. Created a fast data update system using Node.js and helped design the system architecture for the 'Program Legislasi Nasional DPR' project to improve how legal data is shown and managed.",
        startDate: "Aug 2023",
        endDate: "Dec 2023",
        img: dpr,
        bgColor: "bg-zinc-700",
        url: "",
    },
];
export default Works;
