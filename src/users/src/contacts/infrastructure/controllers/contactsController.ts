import { Request, Response } from 'express';
import { CreateContacts } from '../../application/use-cases/createContacts';

export class ContactsController {
    constructor(private createContacts: CreateContacts) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { firstName, lastName, email, phoneNumber, contactId } = req.body;

            if (!firstName || !lastName || !email || !phoneNumber) {
                res.status(400).send({ message: 'Missing required fields' });
                return;
            }

            const contactData = { firstName, lastName, email, phoneNumber, contactId };

            await this.createContacts.execute(contactData);
            res.status(201).send({ message: 'Contact created successfully and event sent' });
        } catch (error) {
            console.error('Error creating contact:', error);
            res.status(500).send({ message: 'Failed to create contact', error });
        }
    }
}
