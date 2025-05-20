import HomeRecentWork from "./HomeRecentWork/HomeRecentWork";
import HomeEntrance from "./HomeEntrance/HomeEntrance";
import HomeAbout from "./HomeAbout/HomeAbout";
import HomeProject from "./HomeProject/HomeProject";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import HomeBlog from "../Home/HomeBlog/HomeBlog";
const Home = ({ entranceAnimationDone, handleButtonNavigation }) => {
    return (
        <>
            <HomeEntrance
                entranceAnimationDone={entranceAnimationDone}
            ></HomeEntrance>
            {entranceAnimationDone && (
                <>
                    <HomeAbout></HomeAbout>
                    <HomeRecentWork></HomeRecentWork>
                    {/* <HomeProject></HomeProject> */}
                    <HomeBlog />
                </>
            )}
        </>
    );
};

export default Home;
