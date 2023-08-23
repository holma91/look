import json


def test_get_product(test_app):
    response = test_app.get(
        "/products/product?product_url=https://softgoat.com/p/mens-fine-knit-t-shirt-light-grey/"
    )
    print(response.content)
    assert response.status_code == 200


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
        headers={
            "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjYzODBlZjEyZjk1ZjkxNmNhZDdhNGNlMzg4ZDJjMmMzYzIzMDJmZGUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQWxleGFuZGVyIEhvbG1iZXJnIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGNoRjRfYUlxYzdZeFFISjBFUFpPSWg1MHduVVZyRkJfc0t5UnZGeWlDaz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9sb29rLTk3YTg0IiwiYXVkIjoibG9vay05N2E4NCIsImF1dGhfdGltZSI6MTY5MjM0MDcwOCwidXNlcl9pZCI6IkNvUkR6ZzRtdXpPSjVJVmZHT3R3U2pJUjhNbzEiLCJzdWIiOiJDb1JEemc0bXV6T0o1SVZmR090d1NqSVI4TW8xIiwiaWF0IjoxNjkyNjI1MDIwLCJleHAiOjE2OTI2Mjg2MjAsImVtYWlsIjoiYWxleGFuZGVyaG9sbWJlcmc5MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExNzM5NjA1OTA4NDIwODc5MzE3MSJdLCJlbWFpbCI6WyJhbGV4YW5kZXJob2xtYmVyZzkxQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.FZoT5HfvSw6L2DtVwlGJ910llVDcbA9p4cfYErb4Y-9XrTNfmdx8Uvos3TdqYNqV3Alq4JEtKdImzaVc-CDlUuFnXtRuE-YDGY-ofc79NaEfdcUk_uP7Cf6uy3PxVm5vvo7wImqDfr_3YSZ80UwpA8gBi_vwaDw7RKt-enEtOWis9-aIpiE3x0M7vXnq9dNX-spjMVy3QMKruxMT2ahU3Thfi2zAC8MWye_10F8L3mSGqtPgw2rXwY-vpMzu3uas-41o7Eac3-nosH37AOaphoaLyVXqAWYHGoJv5bToKGD7aJW3CXCYgdzgYRWYzmuTYo9QNt6lzpwehZde8MzkaQ",
        },
    )
    assert response.status_code == 422
