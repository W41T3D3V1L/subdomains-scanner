'use server';

import { z } from 'zod';

const DomainSchema = z.string().min(1, { message: 'Domain cannot be empty' }).refine(domain => {
    // Basic domain validation (not exhaustive)
    try {
        new URL(`http://${domain}`);
        return domain.includes('.');
    } catch (_) {
        return false;
    }
}, { message: 'Invalid domain format' });


export interface ScanResult {
    success: boolean;
    data?: string[];
    error?: string;
}

// IMPORTANT: In a real application, store this key securely in environment variables!
// const apiKey = process.env.RAPIDAPI_KEY;
const apiKey = '0439e6a05bmsh0b48dc0f8dbedebp1a8fc6jsne4152f778894'; // As provided by user
const apiHost = 'subdomain-scan1.p.rapidapi.com';

export async function scanSubdomains(domain: string): Promise<ScanResult> {
    const validationResult = DomainSchema.safeParse(domain);
    if (!validationResult.success) {
        return { success: false, error: validationResult.error.errors[0].message };
    }

    if (!apiKey) {
        console.error("API key is missing.");
        return { success: false, error: "Server configuration error: API key missing." };
    }

    const url = `https://${apiHost}/?domain=${encodeURIComponent(validationResult.data)}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': apiHost,
        },
        // Disable caching for fresh results each time
        cache: 'no-store' as RequestCache
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error (${response.status}): ${errorText}`);
            // Provide a more user-friendly error message
            let userError = `Failed to fetch subdomains (Status: ${response.status}).`;
            if (response.status === 429) {
                userError = "API rate limit exceeded. Please try again later.";
            } else if (response.status === 401 || response.status === 403) {
                 userError = "API authentication failed. Check server configuration.";
            }
            return { success: false, error: userError };
        }

        const result = await response.json();

        // Check if the result is an array of strings
        if (!Array.isArray(result) || !result.every(item => typeof item === 'string')) {
             console.error("API returned unexpected data format:", result);
             return { success: false, error: "Received unexpected data format from API." };
        }

        return { success: true, data: result as string[] };

    } catch (error) {
        console.error("Network or fetch error:", error);
        if (error instanceof Error) {
            return { success: false, error: `An error occurred: ${error.message}` };
        }
        return { success: false, error: 'An unknown network error occurred.' };
    }
}
