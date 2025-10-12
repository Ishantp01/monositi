import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = ({ themeColor = "#E34F4F" }) => {
  const currentYear = new Date().getFullYear();

  // const gradientStyle = {
  //   background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}CC 100%)`,
  // };

  return (
    <footer
      // style={gradientStyle}
      className="w-full bg-gray-700 text-white"
    >
      {/* Newsletter Section */}
      {/* <div className="container mx-auto px-4 py-12"></div> */}

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h4 className="text-xl font-bold mb-4">Monositi</h4>
          <p className="text-white/70 mb-4">
            Your trusted partner for finding the perfect property. We connect
            property seekers with verified listings across India.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-white hover:text-blue-300 transition-colors"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="#"
              className="text-white hover:text-blue-300 transition-colors"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="#"
              className="text-white hover:text-blue-300 transition-colors"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="#"
              className="text-white hover:text-blue-300 transition-colors"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-white/70 hover:text-white transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/properties"
                className="text-white/70 hover:text-white transition-colors"
              >
                Properties
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-white/70 hover:text-white transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-white/70 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="text-white/70 hover:text-white transition-colors"
              >
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Property Types */}
        <div>
          <h4 className="text-xl font-bold mb-4">Property Types</h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/properties?type=pg"
                className="text-white/70 hover:text-white transition-colors"
              >
                PG Accommodation
              </Link>
            </li>
            <li>
              <Link
                to="/properties?type=hostel"
                className="text-white/70 hover:text-white transition-colors"
              >
                Hostels
              </Link>
            </li>
            <li>
              <Link
                to="/properties?type=flat"
                className="text-white/70 hover:text-white transition-colors"
              >
                Flats & Apartments
              </Link>
            </li>
            <li>
              <Link
                to="/properties?type=commercial"
                className="text-white/70 hover:text-white transition-colors"
              >
                Commercial Properties
              </Link>
            </li>
            <li>
              <Link
                to="/properties?type=villa"
                className="text-white/70 hover:text-white transition-colors"
              >
                Villas & Independent Houses
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-xl font-bold mb-4">Contact Us</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-white/70">
                123 Property Street, Real Estate City, India - 400001
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-white/70">+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-white/70">info@monositi.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-center md:text-left">
            © {currentYear} Monositi. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex flex-wrap justify-center gap-4">
            <Link
              to="/terms"
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              to="/cookies"
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
