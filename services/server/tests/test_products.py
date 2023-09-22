import json
import logging
import pytest
from app.pydantic.requests import ProductImagesRequest

BASE_PRODUCT = {
    "url": "https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html",
}


# test_app.post(
#     "/products",
#     content=json.dumps(
#         {
#             "brand": "Zalando",
#             "currency": "SEK",
#             "domain": "zalando.se",
#             "images": [
#                 "https://img01.ztat.net/article/spp-media-p1/e821827b5b3e4af3900008c9050696a8/a7ee6fbed5764b85839ed9c05ec2eeaa.jpg",
#                 "https://img01.ztat.net/article/spp-media-p1/3c6c70ef26804275b82b0b0814a08317/84a7df03e65e419297acc827847fe28a.jpg",
#                 "https://img01.ztat.net/article/spp-media-p1/0e36a35018d64ace8104794b4b93e909/e75ddafe5ce647a0aff95dbdc1b605dc.jpg",
#                 "https://img01.ztat.net/article/spp-media-p1/ef6d4f19d80442e0add96dc2bf82672a/c40f4e82ba6546f69b76a9e3dc7641a1.jpg",
#                 "https://img01.ztat.net/article/spp-media-p1/e03c271f870649a58f7e6f96b94e9a9b/0202ecddfb4d4af29c47eb2fd20f7498.jpg",
#             ],
#             "name": "OCEANIC ZIP HOODIE - Tröja med dragkedja",
#             "price": "3725",
#             "schemaUrl": "/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html",
#             "url": "https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html",
#         }
#     ),
# )

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

### GET


def test_get_product_match(test_app):
    response = test_app.get(f"/products/product?product_url={BASE_PRODUCT['url']}")
    assert response.status_code == 200


def test_get_product_no_match(test_app):
    response = test_app.get(f"/products/product?product_url=zzz{BASE_PRODUCT['url']}")
    assert response.status_code == 404


def test_get_products_match(test_app):
    response = test_app.get(
        "/products",
        params={
            "list": "history",
            "website": ["zalando", "softgoat"],  # maybe change "website" to "company"
        },
    )

    assert response.status_code == 200
    assert len(response.json()) > 0


def test_get_products_no_match(test_app):
    response = test_app.get(
        "/products", params={"list": "likes", "brand": ["NonExistentBrand"]}
    )

    assert response.status_code == 200
    assert response.json() == []


# ### POST


def test_add_product(test_app):
    response = test_app.post(
        "/products",
        content=json.dumps(
            {
                "brand": "Gucci",
                "currency": "USD",
                "domain": "gucci.com",
                "images": [
                    "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1685033125/760123_FACLK_1094_001_083_0000_Light-GG-Crystal-messenger-bag.jpg",
                    "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1685033126/760123_FACLK_1094_002_083_0000_Light-GG-Crystal-messenger-bag.jpg",
                    "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1685033127/760123_FACLK_1094_003_100_0000_Light-GG-Crystal-messenger-bag.jpg",
                    "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1685033128/760123_FACLK_1094_009_083_0000_Light-GG-Crystal-messenger-bag.jpg",
                    "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1685033129/760123_FACLK_1094_010_083_0000_Light-GG-Crystal-messenger-bag.jpg",
                    "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1685033130/760123_FACLK_1094_012_083_0000_Light-GG-Crystal-messenger-bag.jpg",
                    "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1685033130/760123_FACLK_1094_013_083_0000_Light-GG-Crystal-messenger-bag.jpg",
                    "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1685033132/760123_FACLK_1094_015_083_0000_Light-GG-Crystal-messenger-bag.jpg",
                ],
                "name": "GG Crystal messenger bag",
                "price": "1690.0",
                "schemaUrl": "https://www.gucci.com/us/en/pr/men/bags-for-men/messengers-crossbody-bags-for-men/gg-crystal-messenger-bag-p-760123FACLK1094",
                "url": "https://www.gucci.com/us/en/pr/men/bags-for-men/messengers-crossbody-bags-for-men/gg-messenger-bag-p-760123FACJN9765",
            }
        ),
    )

    assert response.status_code == 201 or response.status_code == 409


def test_add_product_invalid_json(test_app):
    response = test_app.post(
        "/products",
        content=json.dumps({}),
    )
    assert response.status_code == 422


def test_add_product_images_valid(test_app):
    # Assuming that a product with this URL already exists in the test database
    image_urls = [
        "https://www.example.com/image/1.jpg",
        "https://www.example.com/image/2.jpg",
    ]
    response = test_app.post(
        "/products/images",
        json=ProductImagesRequest(
            product_url=BASE_PRODUCT["url"], image_urls=image_urls
        ).dict(),
    )
    assert response.status_code == 201 or response.status_code == 409


def test_add_product_images_invalid(test_app):
    # Assuming that a product with this URL already exists in the test database
    image_urls = [
        "https://www.example.com/image/1.jpg",
        "https://www.example.com/image/2.jpg",
    ]
    response = test_app.post(
        "/products/images",
        json=ProductImagesRequest(
            product_url=BASE_PRODUCT["url"] + "chars", image_urls=image_urls
        ).dict(),
    )
    assert response.status_code == 409
