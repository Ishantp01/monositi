import GradientHeading from "../GradientHeading";
import OutlineButton from "../MoreButton";
import PropertySlider5 from "../Carousel/PropertiesSlider5";
import PropertySlider6 from "../Carousel/PropertiesSlider6";
import PropertySlider7 from "../Carousel/PropertiesSlider7";

const PgHotel = () => {
    return (
        <>
            <GradientHeading text={"Find Hostel And PG Away From Home in City"} />
            <div className="my-8 md:my-16">
                <PropertySlider5 properties={properties} id={1} />
            </div>
            <GradientHeading text={"Featured PG And Hostel "} />
            <div className="my-8 md:my-16">
                <PropertySlider6 id={1} />
            </div>
            <OutlineButton />
            <GradientHeading text={"PG Homes with Wi-Fi"} />
            <div className="my-8 md:my-16">
                <PropertySlider7 id={1} />
            </div>
            <OutlineButton />
        </>
    )
}
export default PgHotel;

const properties = [
  {
    title: "Student Friendly PG’s",
    buttonText: "Explore",
    image: "https://tse2.mm.bing.net/th/id/OIP.OaeC1EGfr9R0AV9YNSbfIQHaFj?pid=Api&P=0&h=180",
  },
  {
    title: "PG For Girls",
    buttonText: "Explore",
    image: "https://images.unsplash.com/photo-1599423300746-b62533397364?q=80&w=1200",
  },
  {
    title: "PG For Boys",
    buttonText: "Explore",
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1200",
  },
  {
    title: "Hostel For Girls",
    buttonText: "Explore",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200",
  },
  {
    title: "PG For Mens",
    buttonText: "Explore",
    image: "https://tse4.mm.bing.net/th/id/OIP.-OE6_VfmH29NPigtlqk--wHaE8?pid=Api&P=0&h=180",
  },
];