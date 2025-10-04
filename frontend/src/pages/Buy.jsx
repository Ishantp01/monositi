import React from 'react'
import Navbar from '../components/NavBar'
import Footer from '../components/Footer'
import Carousel from '../components/Buy/Carousel'
import PropertyDetail from '../components/Buy/PropertyDetail'
import avatar from '../assets/images/avatar2.jpg'

const Buy = () => {
  return (
    <>
      <Navbar avatarUrl={avatar} />
      <div className="mt-8 md:mt-16">
        <Carousel/>
        <PropertyDetail/>
      </div>
      <Footer />
    </>
  )
}

export default Buy