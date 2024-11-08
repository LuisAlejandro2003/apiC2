// src/notifications/infrastructure/adapters/rabbitMQListener.ts
import amqp from 'amqplib';
import { MessageQueueListener } from '../../domain/ports/MessageQueueListener';
import { NotificationsController } from '../controllers/NotificationsController';

export class RabbitMQListener implements MessageQueueListener {
    constructor(private notificationsController: NotificationsController) {}

    async listenToQueues(): Promise<void> {
        const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost');
        const channel = await connection.createChannel();
        const queues = ['contact.created', 'user.created', 'payments.created'];

        for (const queue of queues) {
            await channel.assertQueue(queue, { durable: true });
            channel.consume(queue, async (msg) => {
                if (msg) {
                    const payload = JSON.parse(msg.content.toString());
                    await this.notificationsController.handleNotification(queue, payload);
                    channel.ack(msg);
                }
            });
        }
    }
}
