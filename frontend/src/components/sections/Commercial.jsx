import GradientHeading from "../common/GradientHeading";
import PropertySlider5 from "../Carousel/PropertiesSlider5";
import PropertySlider8 from "../Carousel/PropertiesSlider8";
import PropertySlider9 from "../Carousel/PropertiesSlider9";
import { Link } from "react-router-dom";
import PropertyCarousel from "../Carousel/PropertiesSlider";

const Commercial = () => {
  return (
    <>
      <div className="w-full h-16"></div>
      <GradientHeading text={"Properties by Owners"} />
      <div className="my-8 md:my-16">
        <PropertyCarousel tags={"Commercial"} />
      </div>
      <div className="w-full h-16"></div>
    </>
  );
};
export default Commercial;

export const officeSpaces = [
  {
    title: "Office Space",
    price: 83000,
    seats: "14-20 Seats",
    locality: "Block 4th Tilwara",
    posted: "Jun 08, '25",
    owner: "Hemant Kumar",
    image:
      "https://allmakes.com/wp-content/uploads/2017/10/office-space-planning.jpg",
  },
  {
    title: "Corporate Office",
    price: 65000,
    seats: "10-15 Seats",
    locality: "Civil Lines",
    posted: "May 15, '25",
    owner: "Priya Sharma",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.qVKqQlLUZWc26HN5vPHSdQHaE6?pid=Api&P=0&h=180",
  },
  {
    title: "Startup Office",
    price: 50000,
    seats: "8-12 Seats",
    locality: "Napier Town",
    posted: "Apr 20, '25",
    owner: "Rohit Verma",
    image:
      "https://s3.mortarr.com/images/project_gallery_images/open-concept-office-space-designs.jpeg",
  },
  {
    title: "Shared Office",
    price: 42000,
    seats: "6-10 Seats",
    locality: "Ganjipura",
    posted: "Mar 18, '25",
    owner: "Anita Yadav",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.Q2ylHisUnojXVMEF7As4SAHaE8?pid=Api&P=0&h=180",
  },
  {
    title: "Premium Office",
    price: 120000,
    seats: "20-30 Seats",
    locality: "Wright Town",
    posted: "Feb 28, '25",
    owner: "Manoj Gupta",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.PEKbcy8t_2rqLBuzDsaM-gHaFf?pid=Api&P=0&h=180",
  },
];

export const showrooms = [
  {
    title: "Showroom",
    price: "₹7.3 Lac",
    area: "4830 sqft",
    locality: "Block 4th Tilwara",
    mainRoadFacing: true,
    owner: "Hemant Kumar",
    posted: "Jun 08, '25",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.85Plp5YZzSiHkpi4JMo-ygHaE8?pid=Api&P=0&h=180",
  },
  {
    title: "Retail Showroom",
    price: "₹5.8 Lac",
    area: "3500 sqft",
    locality: "Civil Lines",
    mainRoadFacing: true,
    owner: "Priya Sharma",
    posted: "May 15, '25",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.lAfOiRKWvTC70FvyEr3ukQHaFj?pid=Api&P=0&h=180",
  },
  {
    title: "Luxury Showroom",
    price: "₹9.2 Lac",
    area: "5200 sqft",
    locality: "Napier Town",
    mainRoadFacing: true,
    owner: "Rohit Verma",
    posted: "Apr 20, '25",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.1dAmMu1CWi8s7KwWOWka4AHaE8?pid=Api&P=0&h=180",
  },
  {
    title: "Car Showroom",
    price: "₹6.5 Lac",
    area: "4000 sqft",
    locality: "Ganjipura",
    mainRoadFacing: true,
    owner: "Anita Yadav",
    posted: "Mar 18, '25",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.PrmoqJX5qNDOOwH0VFYLZwHaFj?pid=Api&P=0&h=180",
  },
  {
    title: "Premium Showroom",
    price: "₹10.0 Lac",
    area: "6000 sqft",
    locality: "Wright Town",
    mainRoadFacing: true,
    owner: "Manoj Gupta",
    posted: "Feb 28, '25",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.zp3UWJDS4WCzDYy_HHVCWAHaE8?pid=Api&P=0&h=180",
  },
];
