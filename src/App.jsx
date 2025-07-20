import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import avatar from "../src/assets/images/avatar2.jpg"
import Carousel from "./components/Carousel";
import TabsWithSearch from "./components/Tabs";
import Buy from "./components/sections/Buy";



function App() {

  return (
    <>
      <Navbar avatarUrl={avatar} />
      <div className="mt-8 md:mt-16">
      <Carousel interval={8000} />
      </div>
      <TabsWithSearch />
      <Buy />
      <Footer />
    </>
  )
}

export default App
