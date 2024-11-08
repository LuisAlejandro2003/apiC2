export interface MessageQueueListener {
    listenToQueues(): Promise<void>;
}
