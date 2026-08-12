import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productCatalogueGet, checkoutSessionCreate } from "./ApiService";
import { useBasket } from "./BasketContext";
import QuantityStepper from "./QuantityStepper";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToBasket } = useBasket();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productCatalogueGet();
        if (response.status === "success") {
          const found = response.products.find(
            (p) => p.id.toString() === id.toString()
          );
          if (found) {
            setProduct(found);
          } else {
            setError("Product not found.");
          }
        } else {
          setError("Failed to fetch product details.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuyNow = async () => {
    if (!product || !product.stripe_price_id) {
      alert("This product is not configured for online purchasing.");
      return;
    }

    try {
      setIsBuyingNow(true);
      const response = await checkoutSessionCreate({
        items: [{ stripe_price_id: product.stripe_price_id, quantity }],
      });

      if (response.status === "success" && response.url) {
        window.location.href = response.url;
      } else {
        alert(response.message || "Failed to create checkout session.");
      }
    } catch (err) {
      alert(err.message || "An error occurred.");
    } finally {
      setIsBuyingNow(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">{error || "Product not found"}</div>
        <Link to="/shop" className="btn btn-secondary">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/shop">Shop</Link>
          </li>
          <li className="breadcrumb-item active">{product.name}</li>
        </ol>
      </nav>

      <div className="row g-5 mt-2">
        <div className="col-md-6">
          <div className="p-4 bg-light text-center border rounded">
            <h5>{product.name} Image</h5>
          </div>
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="badge bg-secondary text-capitalize">{product.type}</p>
          <h3 className="text-success my-3">
            £{parseFloat(product.price_gbp).toFixed(2)}
          </h3>
          <p className="lead">{product.description}</p>

          <div className="my-4">
            <label className="form-label fw-bold">Quantity:</label>
            <QuantityStepper
              quantity={quantity}
              onIncrease={() => setQuantity((q) => q + 1)}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
            />
          </div>

          <div className="d-flex gap-3">
            <button
              className="btn btn-outline-primary btn-lg"
              onClick={() => addToBasket(product, quantity, true)}
            >
              Add to basket
            </button>
            <button
              className="btn btn-primary btn-lg"
              disabled={isBuyingNow}
              onClick={handleBuyNow}
            >
              {isBuyingNow ? "Processing..." : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;