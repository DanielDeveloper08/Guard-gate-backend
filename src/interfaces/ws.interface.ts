export interface MessageI {
    messaging_product: string;
    to:                string;
    type:              string;
    template:          Template;
}

export interface Template {
    name:     string;
    language: Language;
}

export interface Language {
    code: string;
}

export interface SendMessageI {
    visitorPhone:   string;
    visitorName:    string;
    residentName:   string;
}
