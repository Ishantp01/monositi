const highlights = [
  "Best of Everything, Luxury Residential Apartments",
  "Ensure your privacy, ample storage spaces",
  "No Common walls",
  "Ready To Move in",
  "Located in the heart of Whitefield",
  "Spread over 2.29 acres with 45% of open spaces",
];

const Highlights = () => (
  <section className="max-w-7xl mx-auto px-4 pb-10">
    <h2 className="text-xl md:text-2xl font-semibold mb-4">Highlights</h2>
    <ul className="list-decimal list-inside space-y-1 text-sm md:text-base text-gray-700">
      {highlights.map((point, i) => (
        <li key={i}>{point}</li>
      ))}
    </ul>
  </section>
);

export default Highlights;
