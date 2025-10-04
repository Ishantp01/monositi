export const PropertyCardStyle = ({ data }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-8">
            {data.map((property) => (
                <div
                    key={property.id}
                    className="flex rounded-xl border border-red-600 overflow-hidden h-40 shadow-sm hover:shadow-md transition"
                >
                    <img
                        src={property.image}
                        alt={property.title}
                        className="w-2/5 object-cover"
                    />
                    <div className="p-4 w-3/5 flex flex-col justify-center">
                        <h3 className="font-semibold text-[1rem]">{property.title}</h3>
                        <p className="text-sm text-gray-500">{property.company}</p>
                        <p className="text-sm text-gray-500">{property.location}</p>
                        <p className="text-sm mt-2">{property.types}</p>
                        <p className="text-sm font-semibold mt-1">
                            {property.price}
                            <span className="text-gray-400 font-normal"> Onwards</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>

    );
};
