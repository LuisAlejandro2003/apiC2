import express from 'express';
import { paymentsRouter } from './payments/infrastructure/routes/paymentsRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/v1/payments', paymentsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
