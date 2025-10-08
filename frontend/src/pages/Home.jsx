import Navbar from "../components/NavBar"
import Footer from "../components/Footer";
import avatar from "../assets/images/avatar2.jpg"
import Carousel from "../components/Carousel";
import TabsWithSearch from "../components/Tabs";

const Home = () => {

    return (
        <>
            <Navbar avatarUrl={avatar} />
            <div className="mt-8 md:mt-16">
                <Carousel interval={8000} />
            </div>
            <TabsWithSearch />
            <Footer />
        </>
    )   
}
export default Home;