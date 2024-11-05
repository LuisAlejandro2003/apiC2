export interface EventPublisher {
    emit(event: string, data: any): Promise<void>;
}
