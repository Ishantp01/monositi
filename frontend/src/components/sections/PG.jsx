import OutlineButton from "../MoreButton";
import GradientHeading from "../GradientHeading";
import HostelCarousel from "../PG/components /HostelCarousel";
import PGSections from "../PG/components /PGSections";

const PG = ({ onViewDetails }) => {
    return (
        <>
            <GradientHeading text={"Find Hostel And PG Away From Home in City"} />
           <div className="my-8 md:my-16 mx-auto max-w-[95%]"> <HostelCarousel onViewDetails={onViewDetails} /></div>
            <GradientHeading text={"Featured PG And Hostel"} />
            <div className="my-8 md:my-16 mx-auto max-w-[95%]"> <PGSections onViewDetails={onViewDetails} /></div>
            <OutlineButton />   
        </>
    )
}
export default PG;