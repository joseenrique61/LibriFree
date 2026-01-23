// src/utils/apiClient.ts
import { API_BASE_URL } from '../api';

// --- DTO Interfaces ---
export interface LoginRequestDto {
    username: string;
    password: string;
}

export interface AuthResponseDto {
    token: string;
    expiresIn: number;
}

export interface ErrorDto {
    code: number;
    message: string;
}

export enum LoanStatus {
    Active = "Active",
    Returned = "Returned",
    Overdue = "Overdue"
}

export interface BookDto {
    id: number;
    title: string;
    author: string;
    isbn: string;
    category: string;
    stock: number;
    available: number;
}

export interface BookInputDto {
    title: string;
    author: string;
    isbn: string;
    category: string;
    stock: number;
}

export interface MemberDto {
    id: number;
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    status: boolean;
}

export interface MemberInputDto {
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    status: boolean;
}

export interface LoanDto {
    id: number;
    bookId: number;
    bookTitle: string;
    memberId: number;
    memberName: string;
    loanDate: string; // ISO date string
    dueDate: string; // ISO date string
    returnDate: string | null; // ISO date string or null
    status: string; // "Active" | "Returned" | "Overdue"
}

export interface LoanInputDto {
    bookId: number;
    memberId: number;
    dueDate: string; // ISO date string
}


// --- API Client ---
interface RequestOptions extends RequestInit {
    // You can add custom options here if needed
}

export async function apiClient<T>(
    endpoint: string,
    options?: RequestOptions
): Promise<T> {
    const token = localStorage.getItem('jwt_token');
    const headers = {
        'Content-Type': 'application/json',
        ...options?.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        // Attempt to parse error message from backend
        let errorData: ErrorDto | { message: string } = { code: response.status, message: 'An unknown error occurred.' };
        errorData.message = await response.text() || response.statusText;
        throw new Error(errorData.message || 'Something went wrong with the request.');
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return null as T;
    }

    return response.json();
}
