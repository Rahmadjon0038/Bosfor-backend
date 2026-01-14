#!/bin/bash

echo "=== Bosfor Backend API Test ==="

# 1. Test category yaratish
echo "1. Creating test category..."
curl -X POST http://localhost:3000/api/categories/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Kiyimlar",
    "images": ["https://example.com/image1.jpg"]
  }'

echo -e "\n\n"

# 2. Test product yaratish
echo "2. Creating test product..."
curl -X POST http://localhost:3000/api/products/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Futbolka",
    "price": 50000,
    "count": 10,
    "images": ["https://example.com/product1.jpg"],
    "isliked": false,
    "incart": false,
    "category_id": 1
  }'

echo -e "\n\n"

# 3. Barcha mahsulotlarni olish
echo "3. Getting all products..."
curl -X GET http://localhost:3000/api/products/all

echo -e "\n\n"

# 4. Like qilish test
echo "4. Testing like functionality..."
curl -X PATCH http://localhost:3000/api/products/like/1 \
  -H "Content-Type: application/json" \
  -d '{"isliked": true}'

echo -e "\n\n"

# 5. Liked products ni olish
echo "5. Getting liked products..."
curl -X GET http://localhost:3000/api/products/liked

echo -e "\n\n"

# 6. Cart ga qo'shish test
echo "6. Testing cart functionality..."
curl -X PATCH http://localhost:3000/api/products/cart/1 \
  -H "Content-Type: application/json" \
  -d '{"incart": true}'

echo -e "\n\n"

# 7. Cart products ni olish
echo "7. Getting cart products..."
curl -X GET http://localhost:3000/api/products/cart

echo -e "\n\n"
echo "=== Test tugadi ==="