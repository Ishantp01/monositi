import PropertyCarousel from "../Carousel/PropertiesSlider";
import PropertySlider3 from "../Carousel/PropertiesSlider3";
import PropertySlider4 from "../Carousel/PropertiesSlider4";
import GradientHeading from "../GradientHeading";
import OutlineButton from "../MoreButton";

const Rent = () => {
  return (
    <>
      <GradientHeading text={"Popular Owner Properties"} />
      <div className="my-8 md:my-16">
        <PropertyCarousel tags={"Rent"} />
      </div>
      <OutlineButton link="/rentlist" />
    </>
  );
};
export default Rent;
