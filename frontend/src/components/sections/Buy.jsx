import ImageCarousel from "../PropertyDetails/LargeCardCarousel";
import OutlineButton from "../MoreButton";
import GradientHeading from "../GradientHeading";
import PropertyCarousel from "../Carousel/PropertiesSlider";
import PropertySlider2 from "../Carousel/PropertiesSlider2";
import { Link } from "react-router-dom";

const Buy = () => {
  return (
    <>
      <GradientHeading text={"Feature Projects"} />
      <ImageCarousel />
      <OutlineButton link="/salelist" />
      <GradientHeading text={"Popular Owner Properties"} />
      <div className="my-8 md:my-16">
        <PropertyCarousel tags={"Buy"} />
      </div>
      <OutlineButton link="/salelist" />
    </>
  );
};
export default Buy;
