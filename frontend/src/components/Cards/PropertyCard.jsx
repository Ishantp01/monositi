import React from "react";

const PropertyCard = (props) => {
  const property = props.property || props.data || {};

  const imageSrc =
    property.image ||
    property.coverImage ||
    (property.images && property.images[0]) ||
    "";
  const title = property.title || property.name || "Untitled";
  const builder =
    property.builder || property.builderName || property.ownerName || "";
  const superArea =
    property.superArea || property.superAreaSqft || property.area || "";
  const possession = property.possession || property.status || "";
  const transaction = property.transaction || property.transactionType || "";
  const furnishing = property.furnishing || property.furnishingStatus || "";
  const bedrooms = property.bedrooms || property.beds || property.bhk || "";
  const bathrooms = property.bathrooms || property.baths || "";
  const price = property.price || property.expectedPrice || "";
  const pricePerSqft = property.pricePerSqft || property.ppsqft || "";
  const description = property.description || "";
  const builderInfo = property.builderInfo || "";

  if (!props.property && !props.data) return null;

  return (
    <div className="property-card">
      {imageSrc ? (
        <img src={imageSrc} alt={title} className="property-image" />
      ) : (
        <div className="property-image" />
      )}
      <div className="property-content">
        <h3 className="property-title">{title}</h3>
        {builder && <p className="property-builder">{builder}</p>}
        <div className="property-info">
          <div>
            <strong>Super Area</strong>
            <br />
            {superArea}
          </div>
          <div>
            <strong>Under Construction</strong>
            <br />
            {possession}
          </div>
          <div>
            <strong>Transaction</strong>
            <br />
            {transaction}
          </div>
          <div>
            <strong>Furnishing</strong>
            <br />
            {furnishing}
          </div>
          <div>
            <strong>Bedrooms</strong>
            <br />
            {bedrooms}
          </div>
          <div>
            <strong>Bathroom</strong>
            <br />
            {bathrooms}
          </div>
        </div>
        <div className="property-actions">
          <div className="property-price">
            <h2>{price}</h2>
            <p>{pricePerSqft}</p>
          </div>
          <div className="property-buttons">
            <button className="callback-btn">Request Callback</button>
            <button className="info-btn">Get Info</button>
          </div>
        </div>
        {description && <p className="property-description">{description}</p>}
        {builderInfo && <p className="property-builder-info">{builderInfo}</p>}
      </div>
    </div>
  );
};

export default PropertyCard;
