import galadinerlgsm from "../../../assets/img/profiles/galadinerlgsm.JPEG";
import mattel from "../../../assets/img/profiles/mattel.jpg";
import dpr from "../../../assets/img/profiles/dpr.jpg";

const Works = [
    {
        id: 1,
        company: "LG Sinar Mas",
        role: "Software Engineer",
        startDate: "Dec 2024",
        endDate: "Present",
        img: galadinerlgsm,
        bgColor: "bg-neutral-800",
        url: "",
    },
    // \Developed and maintained backend logic modules using Java and BizActor to support core MES operations across factories in multiple countries.
    // •
    // Utilized SQL Server Management Studio (SSMS) to analyze production data and validate backend feature requests for performance and accuracy.
    // •
    // Collaborated with QA and manufacturing teams to maintain and scale backend services across production lines.
    {
        id: 2,
        company: "PT. \u00A0Mattel Indonesia",
        role: "Full Stack Developer",
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
        startDate: "Aug 2023",
        endDate: "Dec 2023",
        img: dpr,
        bgColor: "bg-zinc-700",
        url: "",
    },
];
export default Works;
