import React from "react";
import bg from "../assets/images/bg.jpg"; // Or use external URL

const Footer = () => {
    return (
        <footer
            className="relative mt-16 w-full h-auto py-12 px-4 sm:px-8 lg:px-20 bg-cover bg-center"
            style={{
                backgroundImage: `url(${bg})`, // Replace with URL if needed
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 z-0" />

            {/* Content */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 w-full h-full">
                {/* Left Text */}
                <div className="text-white text-center font-inter font-bold sm:my-8 text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl leading-snug max-w-xs sm:max-w-md">
                    Subscribe
                    <span className="hidden sm:inline"><br /></span> To <br />
                    Our Newsletter
                </div>


                {/* Right Form: Always horizontal */}
                <form className="flex flex-row items-center bg-white p-1 sm:p-2 rounded-full w-full sm:w-auto max-w-64 sm:max-w-[500px] overflow-hidden">
                    <input
                        type="email"
                        placeholder="Enter your e-mail..."
                        className="px-4 sm:py-2 rounded-full text-black outline-none w-full sm:w-64 text-sm sm:text-base"
                    />

                    {/* Divider */}
                    <div className="w-px h-8 sm:h-10 bg-gray-400 mx-2" />

                    <button
                        type="submit"
                        className="bg-theme-primary text-white px-4 sm:px-6 py-2 rounded-full hover:opacity-90 transition text-sm sm:text-base whitespace-nowrap"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </footer>
    );
};

export default Footer;
