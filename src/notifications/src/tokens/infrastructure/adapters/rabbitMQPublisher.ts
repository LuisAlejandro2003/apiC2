import amqp from 'amqplib';

export class RabbitMQPublisher {
    private channel: amqp.Channel | null = null;

    constructor(private readonly queueName: string) {}

    async initialize(): Promise<void> {
        const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost');
        this.channel = await connection.createChannel();
        await this.channel.assertQueue(this.queueName, { durable: true });
    }

    async publish(routingKey: string, message: any): Promise<void> {
        if (!this.channel) {
            throw new Error('RabbitMQ channel not initialized');
        }

        this.channel.sendToQueue(routingKey, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });
    }
}
