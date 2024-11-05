import express from 'express';
import dotenv from 'dotenv';
import { initializeDependencies } from './notifications/infrastructure/dependencies';
import { initializeTokenDependencies } from './tokens/infrastructure/dependencies';

dotenv.config();

async function startServer() {
    const app = express();
    app.use(express.json());

    const { notificationsController, rabbitMQListener } = await initializeDependencies();
    const generateToken = await initializeTokenDependencies();

    // Asigna la instancia de `generateToken` al controlador de notificaciones
    notificationsController['generateToken'] = generateToken;

    // Inicia la escucha de las colas en RabbitMQ
    rabbitMQListener.listenToQueues();

    app.listen(3001, () => {
        console.log('Notifications service running on port 3001');
    });
}

startServer().catch((error) => {
    console.error('Error starting server:', error);
});
