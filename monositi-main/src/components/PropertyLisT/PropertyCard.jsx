import React from 'react';

const PropertyCard = ({ property }) => {
  return (
    <div className="property-card">
      <img src={property.image} alt="Property" className="property-image" />
      <div className="property-content">
        <h3 className="property-title">{property.title}</h3>
        <p className="property-builder">{property.builder}</p>
        <div className="property-info">
          <div><strong>Super Area</strong><br />{property.superArea}</div>
          <div><strong>Under Construction</strong><br />{property.possession}</div>
          <div><strong>Transaction</strong><br />{property.transaction}</div>
          <div><strong>Furnishing</strong><br />{property.furnishing}</div>
          <div><strong>Bedrooms</strong><br />{property.bedrooms}</div>
          <div><strong>Bathroom</strong><br />{property.bathrooms}</div>
        </div>
        <div className="property-actions">
          <div className="property-price">
            <h2>{property.price}</h2>
            <p>{property.pricePerSqft}</p>
          </div>
          <div className="property-buttons">
            <button className="callback-btn">Request Callback</button>
            <button className="info-btn">Get Info</button>
          </div>
        </div>
        <p className="property-description">{property.description}</p>
        <p className="property-builder-info">{property.builderInfo}</p>
      </div>
    </div>
  );
};

export default PropertyCard;