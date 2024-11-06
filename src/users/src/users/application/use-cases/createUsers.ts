import { Users } from '../../domain/entities/users';
import { UsersRepository } from '../../domain/ports/usersRepository';
import { UserId } from '../../domain/value-objects/userId';
import { EventPublisher } from '../../domain/ports/EventPublisher';
import { FindContactByEmail } from '../../../contacts/application/use-cases/findContactByEmail';
import { ContactId } from '../../../contacts/domain/value-objects/contactId';
import { PasswordHasher } from '../../domain/ports/PasswordHasher';


export class CreateUsers {
    constructor(
        private usersRepository: UsersRepository,
        private findContactByEmail: FindContactByEmail,
        private eventPublisher: EventPublisher,
        private passwordHasher: PasswordHasher // Inyecta la dependencia
    ) {}

    async execute(userData: { email: string; password: string; }): Promise<void> {
        // Buscar el contacto por email
        const contact = await this.findContactByEmail.execute(userData.email);
        if (!contact) {
            throw new Error('Email not associated with any contact');
        }

        // Generar un nuevo ID de usuario
        const userId = new UserId();
        const contactId = new ContactId(contact.uuid);

        // Hashear la contraseña
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

        // Emitir evento de creación
        await this.eventPublisher.emit('user.created', {
            email: userData.email,
            contactId:userId.value,
            phoneNumber: contact.phoneNumber
        });
    }
}