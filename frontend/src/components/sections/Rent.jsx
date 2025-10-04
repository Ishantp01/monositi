import PropertySlider3 from "../Carousel/PropertiesSlider3";
import PropertySlider4 from "../Carousel/PropertiesSlider4";
import GradientHeading from "../GradientHeading";
import OutlineButton from "../MoreButton";
import { Link } from "react-router-dom";

const Rent = () => {
    return (
        <>
            <GradientHeading text={"Popular Owner Properties"} />
            <div className="my-8 md:my-16">
                <Link to={"/details"}>
                    <PropertySlider3 id={1} />
                </Link>
            </div>
            <OutlineButton link="/rentlist" />
            <GradientHeading text={"Exclusive Owner Properties"} />
            <div className="my-8 md:my-16">
                <Link to={"/details"}>
                    <PropertySlider3 id={2} area={false} />
                </Link>
            </div>
            <OutlineButton link="/rentlist" />
            <GradientHeading text={"Fresh Properties In City"} />
            <div className="my-8 md:my-16">
                <Link to={"/details"}>
                    <PropertySlider3 id={3} area={false} />
                </Link>
            </div>
            <OutlineButton link="/rentlist" />
            <GradientHeading text={"Exclusive Owner Properties"} />
            <div className="my-8 md:my-16">
                <PropertySlider4 link={"/details"} />
            </div>
        </>
    )
}
export default Rent;