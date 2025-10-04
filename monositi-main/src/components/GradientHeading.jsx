const GradientHeading = ({text}) => {
    return (
        <h3
            className="w-fit md:text-3xl font-semibold bg-clip-text text-transparent
                mx-[5%] text-xl md:font-semibold mb-8 md:mb-10
                "
            style={{
                backgroundImage: 'linear-gradient(to right, rgba(191, 17, 18, 1) 74%, rgba(113, 24, 25, 1) 80%, rgba(35, 31, 31, 0.75) 100%)'
            }}
        >
            {text}
        </h3>
    )
}
export default GradientHeading;