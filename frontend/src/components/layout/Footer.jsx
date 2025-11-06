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

  return (
    <footer className="w-full bg-gray-900 text-white mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold">Monositi</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for finding the perfect property. We connect
              property seekers with verified listings across India.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#f73c56] transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#f73c56] transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#f73c56] transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#f73c56] transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-[#f73c56] transition-colors text-sm inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/for-sale"
                  className="text-gray-400 hover:text-[#f73c56] transition-colors text-sm inline-block"
                >
                  Properties for Sale
                </Link>
              </li>
              <li>
                <Link
                  to="/for-rent"
                  className="text-gray-400 hover:text-[#f73c56] transition-colors text-sm inline-block"
                >
                  Properties for Rent
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-400 hover:text-[#f73c56] transition-colors text-sm inline-block"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/monositi"
                  className="text-gray-400 hover:text-[#f73c56] transition-colors text-sm inline-block"
                >
                  Monositi PG
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold">Property Types</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/monositi"
                  className="text-gray-400 hover:text-[#f73c56] transition-colors text-sm inline-block"
                >
                  PG Accommodation
                </Link>
              </li>
              <li>
                <Link
                  to="/for-rent"
                  className="text-gray-400 hover:text-[#f73c56] transition-colors text-sm inline-block"
                >
                  Hostels
                </Link>
              </li>
              <li>
                <Link
                  to="/for-sale"
                  className="text-gray-400 hover:text-[#f73c56] transition-colors text-sm inline-block"
                >
                  Flats & Apartments
                </Link>
              </li>
              <li>
                <Link
                  to="/commercial"
                  className="text-gray-400 hover:text-[#f73c56] transition-colors text-sm inline-block"
                >
                  Commercial Properties
                </Link>
              </li>
              <li>
                <Link
                  to="/for-sale"
                  className="text-gray-400 hover:text-[#f73c56] transition-colors text-sm inline-block"
                >
                  Villas & Houses
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="w-4 h-4 text-[#f73c56] mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  123 Property Street, Real Estate City, India - 400001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="w-4 h-4 text-[#f73c56] flex-shrink-0" />
                <span className="text-gray-400 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="w-4 h-4 text-[#f73c56] flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@monositi.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Monositi. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/terms"
                className="text-gray-400 hover:text-[#f73c56] transition-colors text-sm"
              >
                Terms & Conditions
              </Link>
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-[#f73c56] transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-[#f73c56] transition-colors text-sm"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
