export enum SurveyFieldType {
    TEXT = 'text',
    TEXTAREA = 'textarea',
    BOOLEAN = 'boolean',
    RADIO = 'radio',
    CHECKBOX = 'checkbox'
}

export interface SurveyOption {
    label: string;
    value: unknown;
}

interface ISurveyField {
    label: string;
    description?: string;
    type: SurveyFieldType;
    options?: string[];
    required?: boolean;
}

export interface ISurvey {
    title: string;
    description?: string;
    fields: ISurveyField[];
    enabled?: boolean;
    createdAt?: number;
    updatedAt?: number;
}
