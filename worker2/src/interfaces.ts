

export interface User {
    id: number;
    email: string;
    accessToken: string;
    refreshToken: string;
    defaultTemplate?: Template; 
    templates: Template[];
    schedules: Schedule[];
    sentEmails: SentEmail[];
    followUps: FollowUp[];
}

export interface Template {
    id: number;
    name: string;
    label: string;
    subject: string;
    body: string;
    userId: number;
    user: User;
    defaultedBy?: User; 
    schedules: Schedule[];
    sentEmails: SentEmail[];
}

export interface Schedule {
    id: number;
    userId: number;
    user: User;
    templateId: number;
    template: Template;
    recipient: string;
    subject: string;
    body: string;
    sendAt: Date;
    status: number;
}

export interface SentEmail {
    id: number;
    userId: number;
    user: User;
    templateId: number;
    template: Template;
    recipient: string;
    subject: string;
    body: string;
    sentAt: Date;
    openRate: number;
    replyRate: number;
    clickRate: number;
}

export interface FollowUp {
    id: number;
    userId: number;
    user: User;
    originalEmailId?: string; 
    followUpEmailId: string;
    sendAt: Date;
}
