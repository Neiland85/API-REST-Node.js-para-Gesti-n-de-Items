const express = require('express');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

// Inicializa la aplicación de Express
const app = express();

// Credenciales de MongoDB desde variables de entorno
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDBName = process.env.MONGO_DB_NAME;

// Conectar a MongoDB con autenticación
const mongoURI = `mongodb://${mongoUser}:${mongoPassword}@localhost:27017/${mongoDBName}?authSource=admin`;

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Middleware para parsear JSON
app.use(express.json());

// Definir las rutas de productos y autenticación
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API REST Node',
            version: '1.0.0',
            description: 'API REST para gestión de productos'
        }
    },
    apis: ['./routes/*.js'] // Archivos donde están definidas las rutas
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Configuración del puerto y arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
