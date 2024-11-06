import express, { Application } from 'express';
import dotenv from 'dotenv';

import { contactsRouter } from './contacts/infrastructure/routes/contactsRoutes';
import { usersRouter } from './users/infrastructure/routes/usersRoutes';

dotenv.config();
const app: Application = express();


app.use(express.json());

const PORT = process.env.PORT || 3000;

// Configuración de rutas
app.use('/api/v1/contacts', contactsRouter);
app.use('/api/v1/users', usersRouter);

async function startServer() {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

startServer();