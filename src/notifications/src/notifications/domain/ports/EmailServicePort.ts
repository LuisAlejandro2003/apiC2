export interface EmailServicePort {
    send(to: string, message: string): Promise<void>;
}
