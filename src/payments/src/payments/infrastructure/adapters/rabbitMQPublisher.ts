// src/payments/infrastructure/adapters/rabbitMQPublisher.ts
import amqp, { Channel, Connection } from 'amqplib';
import { EventPublisher } from '../../domain/ports/EventPublisher';

export class RabbitMQPublisher implements EventPublisher {
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private readonly exchangeName = 'paymentsExchange';

    async connect(): Promise<void> {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost');
            this.channel = await this.connection.createChannel();

            // Crear un exchange de tipo 'topic' para pagos
            await this.channel.assertExchange(this.exchangeName, 'topic', { durable: true });
            console.log('RabbitMQ connected and exchange declared:', this.exchangeName);

            // Escuchar eventos de cierre de conexión y reintentar
            this.connection.on('close', () => {
                console.log('RabbitMQ connection closed, retrying...');
                setTimeout(() => this.connect(), 5000); // Reintentar conexión después de 5 segundos
            });
        } catch (error) {
            console.error('Failed to connect to RabbitMQ:', error);
            setTimeout(() => this.connect(), 5000); // Reintentar conexión después de 5 segundos en caso de error
        }
    }

    async publish(event: string, data: any): Promise<void> {
        if (!this.channel) throw new Error('RabbitMQ channel not initialized');

        const routingKey = `${event}`; // Define la clave de enrutamiento, por ejemplo: "payments.created"
        
        // Publica el evento en el exchange usando el routingKey
        this.channel.publish(
            this.exchangeName,
            routingKey,
            Buffer.from(JSON.stringify(data)),
            { persistent: true }
        );
        
        console.log(`Event published to RabbitMQ: ${event} with routing key: ${routingKey}`);
    }

    async close(): Promise<void> {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
    }
}
