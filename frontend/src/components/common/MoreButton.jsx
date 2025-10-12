// import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const OutlineButton = ({ link = "/", text = "See All Projects", use = "outside" }) => {
    return (
        <div className={`w-full flex justify-center ${use == "outside" ? "my-8 md:my-10" : "mt-4"}`}>
            <a
                href={link}
                className={`inline-flex items-center justify-center gap-2 ${use == "outside" ? "py-2" : "w-full md:py-3 py-2"} 
               px-4  
               sm:px-5 sm:py-2.5 
               md:px-6 md:py-3 
               lg:px-4 lg:py-2 
               xl:px-4 xl:py-2 
               border md:border-2 border-red-600 text-red-600 
               rounded-full transition-all duration-300 
               hover:bg-theme-primary hover:text-white
               text-base sm:text-lg md:text-lg 
               lg:text-base xl:text-sm 
               font-mediu`}
            >
                <span>{text}</span>
                {
                    use == "outside" ? <ArrowRight
                        className="size-5 sm:size-6 md:size-6 lg:size-5 xl:size-4"
                        strokeWidth={2.5}
                    /> : null
                }
            </a>
        </div>

    );
};

export default OutlineButton;
