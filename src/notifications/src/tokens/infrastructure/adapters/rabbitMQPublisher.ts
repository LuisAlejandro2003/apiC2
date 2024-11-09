import amqp from 'amqplib';

export class RabbitMQPublisher {
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;

    constructor(private readonly queueName: string) {}

    async connect(): Promise<void> {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost');
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue(this.queueName, { durable: true });
            console.log(`RabbitMQ connected to queue ${this.queueName}`);
        } catch (error) {
            console.error('Failed to connect to RabbitMQ:', error);
            throw new Error('Could not establish RabbitMQ connection');
        }
    }

    async publish(routingKey: string, message: any): Promise<void> {
        if (!this.channel) {
            console.warn('RabbitMQ channel not initialized, attempting to connect...');
            await this.connect(); // Reintentar la conexión
        }

        try {
            this.channel!.sendToQueue(routingKey, Buffer.from(JSON.stringify(message)), {
                persistent: true,
            });
            console.log(`Message sent to ${routingKey}:`, message);
        } catch (error) {
            console.error('Failed to publish message:', error);
            throw new Error('Error sending message to RabbitMQ');
        }
    }
}
