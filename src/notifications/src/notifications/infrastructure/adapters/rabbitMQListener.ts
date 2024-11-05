import amqp from 'amqplib';
import { NotificationsController } from '../controllers/NotificationsController';

export class RabbitMQListener {
    constructor(private notificationsController: NotificationsController) {}

    async listenToQueues(): Promise<void> {
        const connection = await amqp.connect('amqp://localhost:5672');
        const channel = await connection.createChannel();
        const queues = ['contact.created', 'user.created'];

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
