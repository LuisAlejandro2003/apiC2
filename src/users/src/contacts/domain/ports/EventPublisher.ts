export interface EventPublisher {
    emit(event: string, data: any): Promise<void>;
    on(event: string, listener: (payload: any) => void): void;
}
