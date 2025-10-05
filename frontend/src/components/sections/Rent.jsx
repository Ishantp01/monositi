import PropertySlider3 from "../Carousel/PropertiesSlider3";
import PropertySlider4 from "../Carousel/PropertiesSlider4";
import GradientHeading from "../GradientHeading";
import OutlineButton from "../MoreButton";

const Rent = () => {
    return (
        <>
            <GradientHeading text={"Popular Owner Properties"} />
            <div className="my-8 md:my-16">
                <PropertySlider3 id={1} />
            </div>
            <OutlineButton link="/rentlist" />
            
        </>
    )
}
export default Rent;