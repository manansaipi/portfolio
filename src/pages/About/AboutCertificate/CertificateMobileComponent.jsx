import { useState } from "react";
import certificates from "./CertificatesList";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";

const CertificateMobileComponent = () => {
	const [isLoadMore, setLoadMore] = useState(false);

	function handleLoadMore() {
		setLoadMore(!isLoadMore);
	}
	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 w-full  lg:hidden gap-10 px-5 md:px-10">
				{certificates.slice(0, isLoadMore ? 99 : 2).map((cert, index) => (
					<a
						key={index}
						href={cert.link}
						target="_blank"
						data-name="view"
						className="flex flex-col  gap-5 text-white h-full  "
					>
						<div className={`h-[50vh] bg-gray-600 pointer-events-none `}>
							<div className="px-5 w-full h-full flex items-center justify-center">
								<img
									className="max-h-[45vh] shadow-lg shadow-black "
									src={cert.image}
									alt=""
								/>
							</div>
						</div>
						<div className="pointer-events-none">
							<div className="text-3xl">{cert.name} </div>
							<div className=" border-b-1 my-5"></div>
							<div className="flex justify-between gap-15">
								<div className="text-justify">{cert.desc}</div>
								<div>{cert.year}</div>
							</div>
						</div>
					</a>
				))}
			</div>
			<div className="flex justify-center py-10">
				<PrimaryButton
					label={isLoadMore ? "SHOW LESS" : "SHOW MORE"}
					handleOnClick={handleLoadMore}
				/>
			</div>
		</>
	);
};

export default CertificateMobileComponent;
