import ImageCarousel from "../LargeCardCarousel";
import OutlineButton from "../MoreButton";
import GradientHeading from "../GradientHeading";
import PropertyCarousel from "../Carousel/PropertiesSlider";
import PropertySlider2 from "../Carousel/PropertiesSlider2";

const Buy = () => {
    return (
        <>
            <GradientHeading text={"Feature Projects"} />
            <ImageCarousel />
            <OutlineButton />
            <GradientHeading text={"Popular Owner Properties"} />
            <div className="my-8 md:my-16">
                <PropertyCarousel />
            </div>
            <OutlineButton />
            <GradientHeading text={"Upcoming Projects"} />
            <div className="my-8 md:my-16">
                <PropertySlider2 />
            </div>
            <OutlineButton />
        </>
    )
}
export default Buy;