export interface TokenSender {
    sendToken(phoneNumber: string, token: string): Promise<void>;
}
