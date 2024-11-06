// src/users/infrastructure/adapters/tokenValidatedSubscriber.ts
import amqp from 'amqplib';
import { UpdateUserVerifiedAt } from '../../application/use-cases/updateUserVerifiedAt';

export class TokenValidatedSubscriber {
    constructor(
        private updateUserVerifiedAt: UpdateUserVerifiedAt,
        private queueUrl: string = 'amqp://localhost' // O tu URL de RabbitMQ
    ) {}

    async listen() {
        const connection = await amqp.connect(this.queueUrl);
        const channel = await connection.createChannel();
        const queue = 'token.validated';

        await channel.assertQueue(queue, { durable: true });
        console.log(`Listening for messages on ${queue}...`);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const content = msg.content.toString();
                const { userId, validatedAt } = JSON.parse(content);

                console.log(`Received message:`, content);

                try {
                    await this.updateUserVerifiedAt.execute(userId, validatedAt);
                    console.log(`User ${userId} verified at ${validatedAt}`);
                } catch (error) {
                    console.error('Error updating user verification:', error);
                }

                channel.ack(msg);
            }
        });
    }
}
