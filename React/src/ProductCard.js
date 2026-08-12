import React from "react";
import { useNavigate } from "react-router-dom";
import { useBasket } from "./BasketContext";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToBasket } = useBasket();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    addToBasket(product, 1, true);
  };

  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    try {
      const filename = imagePath.split("\\").pop().split("/").pop();
      return require(`./Images/${filename}`);
    } catch (e) {
      return null;
    }
  };

  const imageSrc = getImageSrc(product.image_url);

  return (
    <div
      className="card h-100 shadow-sm cursor-pointer"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div
        className="card-img-top bg-light d-flex align-items-center justify-content-center"
        style={{ height: "180px", overflow: "hidden" }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span className="text-muted">No image</span>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title h6 mb-0">{product.name}</h5>
          <span className="badge bg-secondary text-capitalize">
            {product.type}
          </span>
        </div>
        <p className="card-text text-muted small flex-grow-1">
          {product.description}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fw-bold text-success fs-5">
            £{parseFloat(product.price_gbp).toFixed(2)}
          </span>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={handleAddClick}
          >
            Add to basket
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
