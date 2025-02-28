// This file contains TypeScript interfaces and types for the WhatsApp SDK.

export interface Message {
    id: string;
    sender: string;
    recipient: string;
    content: string;
    timestamp: Date;
}

export interface User {
    id: string;
    name: string;
    phoneNumber: string;
}

export interface Chat {
    id: string;
    participants: User[];
    messages: Message[];
}

export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};