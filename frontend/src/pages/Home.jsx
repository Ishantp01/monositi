import Navbar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import avatar from "../assets/images/avatar2.jpg";
import Carousel from "../components/Carousel/Carousel";
import TabsWithSearch from "../components/Tabs/Tabs";

const Home = () => {
  return (
    <>
      <Navbar avatarUrl={avatar} />
      <div className="mt-14 md:mt-24">
        <Carousel interval={8000} />
      </div>
      <TabsWithSearch />
      <Footer />
    </>
  );
};
export default Home;
