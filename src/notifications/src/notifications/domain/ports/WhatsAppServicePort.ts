// src/notifications/domain/ports/WhatsAppServicePort.ts
export interface WhatsAppServicePort {
    send(to: string, message: string): Promise<void>;
}
