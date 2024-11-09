import { CreateContacts } from '../../application/use-cases/createContacts';
import { FindContactByEmail } from '../../application/use-cases/findContactByEmail';
import { FindAllContacts } from '../../application/use-cases/findAllContacts';
import { UpdateContact } from '../../application/use-cases/updateContact';
import { DeleteContact } from '../../application/use-cases/deleteContact';
import { Request, Response } from 'express';

export class ContactsController {
    constructor(
        private createContacts: CreateContacts,
        private findContactByEmail: FindContactByEmail,
        private findAllContacts: FindAllContacts,
        private updateContact: UpdateContact,
        private deleteContact: DeleteContact
    ) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            await this.createContacts.execute({
                ...req.body,
                notificationPreference: req.body.notificationPreference || 'whatsapp'  // Valor por defecto
            });
            res.status(201).send('Contact created successfully');
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async findByEmail(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const contacts = await this.findContactByEmail.execute(email);
            if (contacts) {
                res.status(200).json(contacts);
            } else {
                res.status(404).json({ message: 'Contacts not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const contacts = await this.findAllContacts.execute();
            res.status(200).json(contacts);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            await this.updateContact.execute(req.params.uuid, req.body);
            res.status(200).send('Contact updated successfully');
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            await this.deleteContact.execute(req.params.uuid);
            res.status(200).send('Contact deleted successfully');
        } catch (error) {
            res.status(500).send(error);
        }
    }
}
