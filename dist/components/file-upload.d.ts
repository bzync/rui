import { InputHTMLAttributes } from 'react';
export interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
    hint?: string;
    error?: string;
    accept?: string;
    maxSizeMB?: number;
    onFilesChange?: (files: File[]) => void;
}
export declare const FileUpload: import('react').ForwardRefExoticComponent<FileUploadProps & import('react').RefAttributes<HTMLInputElement>>;
