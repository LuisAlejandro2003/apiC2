import express from 'express';
import dotenv from 'dotenv';
import { initializeDependencies } from './notifications/infrastructure/dependencies';
import { initializeTokenDependencies } from './tokens/infrastructure/dependencies';

dotenv.config();

async function startServer() {
    const app = express();
    app.use(express.json());

    const { notificationsController, rabbitMQListener } = await initializeDependencies();
    const { generateToken } = await initializeTokenDependencies();

    // Verifica el tipo antes de asignar para evitar errores de tipo
    if ('execute' in generateToken) {
        notificationsController.generateToken = generateToken;
    }

    rabbitMQListener.listenToQueues();

    app.listen(3001, () => {
        console.log('Notifications service running on port 3001');
    });
}

startServer().catch((error) => {
    console.error('Error starting server:', error);
});
