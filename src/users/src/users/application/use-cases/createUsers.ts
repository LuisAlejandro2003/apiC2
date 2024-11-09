// createUser.ts
import { Users } from '../../domain/entities/users';
import { UsersRepository } from '../../domain/ports/usersRepository';
import { UserId } from '../../domain/value-objects/userId';
import { EventPublisher } from '../../domain/ports/EventPublisher';
import { FindContactByEmail } from '../../../contacts/application/use-cases/findContactByEmail';
import { PasswordHasher } from '../../domain/ports/PasswordHasher';

export class CreateUsers {
    constructor(
        private usersRepository: UsersRepository,
        private findContactByEmail: FindContactByEmail,
        private eventPublisher: EventPublisher,
        private passwordHasher: PasswordHasher 
    ) {}

    async execute(userData: { email: string; password: string; notificationPreference?: string }): Promise<void> {
        // Buscar el contacto por email
        const contacts = await this.findContactByEmail.execute(userData.email);
        if (!contacts) {
            throw new Error('Email not associated with any contacts');
        }

        // Encapsular el acceso a contacts
        const contactId = contacts.getContactsId();
        const phoneNumber = contacts.getPhoneNumber();

        // Generar un nuevo ID de usuario
        const userId = new UserId();

        // Hashear la contraseña usando el puerto
        const hashedPassword = await this.passwordHasher.hash(userData.password);

        // Crear la entidad de usuario
        const user = new Users(
            userId,
            userData.email,
            hashedPassword,
            null,
            contactId
        );

        // Guardar el usuario
        await this.usersRepository.createUser(user);

        // Emitir evento de creación usando el puerto
        await this.eventPublisher.emit('user.created', {
            email: userData.email,
            contactId: contactId.value,  // Incluir el ID correcto de contacto
            phoneNumber: phoneNumber,
            notificationPreference: userData.notificationPreference || 'whatsapp' // Nuevo campo para preferencia
        });
    }
}
