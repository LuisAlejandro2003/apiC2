import express from 'express';
import dotenv from 'dotenv';
import { initializeDependencies } from './notifications/infrastructure/dependencies';
import { initializeTokenDependencies } from './tokens/infrastructure/dependencies';

dotenv.config();

async function startServer() {
    const app = express();
    app.use(express.json());

    // Inicializa las dependencias de notifications y obtiene el controlador y RabbitMQ listener
    const { notificationsController, rabbitMQListener } = await initializeDependencies();

    // Obtiene la instancia de GenerateToken
    const generateToken = await initializeTokenDependencies();

    // Verifica que la instancia de generateToken tenga la función execute
    if (generateToken && typeof generateToken.execute === 'function') {
        notificationsController.generateToken = generateToken; // Asigna la instancia
    } else {
        throw new Error('La instancia de generateToken no es válida o no tiene la función execute.');
    }

    // Inicia la escucha de las colas en RabbitMQ
    rabbitMQListener.listenToQueues();

    app.listen(3001, () => {
        console.log('Notifications service running on port 3001');
    });
}

startServer().catch((error) => {
    console.error('Error starting server:', error);
});
