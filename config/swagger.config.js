const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node.js Express SQLite3 Auth API",
      version: "1.0.0",
      description:
        "Roʻyxatdan oʻtish, Kirish va Profil maʼlumotlarini olish uchun API hujjatlari.",
      contact: {
        name: "Sizning ismingiz",
        email: "your.email@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api", // Sizning bazaviy URL'ingiz
      },
    ],
    // JWT uchun xavfsizlik sxemasini qo'shamiz
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        // Barcha endpointlar avtomatik token yuborishga tayyor turadi
        bearerAuth: [],
      },
    ],
  },
  // API hujjatlari joylashgan fayllar
  apis: ["./routers/*.js"], // Routers papkasidagi barcha .js fayllarni skanerdan o'tkazadi
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
