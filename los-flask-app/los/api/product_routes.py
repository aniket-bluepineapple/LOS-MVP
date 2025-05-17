from flask import Blueprint, request, jsonify
from datetime import datetime
from los.models import db, Product
from flask_cors import CORS, cross_origin

product_bp = Blueprint("product", __name__, url_prefix="/api/products")
CORS(product_bp)

@product_bp.route("/", methods=["OPTIONS"])
@cross_origin()
def options():
    print("\n Handling preflight request")
    response = jsonify({"message": "CORS preflight response"})
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

# Create a new product
@product_bp.route("/", methods=["POST"])
def create_product():
    data = request.json

    # Validate required fields
    required_fields = ["ProductType", "Price", "InventoryCount"]
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    new_product = Product(
        ProductType=data["ProductType"],
        Description=data.get("Description", ""),
        InventoryCount=data["InventoryCount"],
        Price=data["Price"],
        CreatedAt=datetime.utcnow()
    )

    db.session.add(new_product)
    db.session.commit()

    return jsonify({
        "message": "Product added successfully!",
        "product": {
            "ProductID": new_product.ProductID,
            "ProductType": new_product.ProductType,
            "Description": new_product.Description,
            "InventoryCount": new_product.InventoryCount,
            "Price": str(new_product.Price),
            "CreatedAt": new_product.CreatedAt
        }
    }), 201


# Read all products
@product_bp.route("/", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([
        {
            "ProductID": p.ProductID,
            "ProductType": p.ProductType,
            "Description": p.Description,
            "InventoryCount": p.InventoryCount,
            "Price": str(p.Price),
            "CreatedAt": p.CreatedAt
        }
        for p in products
    ])


# Read a single product
@product_bp.route("/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    return jsonify({
        "ProductID": product.ProductID,
        "ProductType": product.ProductType,
        "Description": product.Description,
        "InventoryCount": product.InventoryCount,
        "Price": str(product.Price),
        "CreatedAt": product.CreatedAt
    })


# Update a product
@product_bp.route("/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    data = request.json
    product.ProductType = data.get("ProductType", product.ProductType)
    product.Description = data.get("Description", product.Description)
    product.InventoryCount = data.get("InventoryCount", product.InventoryCount)
    product.Price = data.get("Price", product.Price)

    db.session.commit()

    return jsonify({"message": "Product updated successfully!"})


# Delete a product
@product_bp.route("/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted successfully!"})
