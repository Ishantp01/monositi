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
            <OutlineButton />
            <GradientHeading text={"Exclusive Owner Properties"} />
            <div className="my-8 md:my-16">
                <PropertySlider3 id={2} area={false} />
            </div>
            <OutlineButton />
            <GradientHeading text={"Fresh Properties In City"} />
            <div className="my-8 md:my-16">
                <PropertySlider3 id={3} area={false} />
            </div>
            <OutlineButton />
            <GradientHeading text={"Exclusive Owner Properties"} />
            <div className="my-8 md:my-16">
                <PropertySlider4 />
            </div>
        </>
    )
}
export default Rent;