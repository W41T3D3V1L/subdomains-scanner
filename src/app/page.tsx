
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Scan, Terminal, ServerCrash, LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { scanSubdomains, type ScanResult } from './actions';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  domain: z.string().min(1, {
    message: 'Domain cannot be empty.',
  }).refine(domain => {
    // Basic domain validation (not exhaustive) - align with server action validation
    try {
      // Allow domains without protocol for validation check
      const url = domain.includes('://') ? domain : `http://${domain}`;
      new URL(url);
      // Ensure it looks like a domain (contains a dot and isn't just a dot)
      return domain.includes('.') && domain.trim() !== '.' && !domain.startsWith('.') && !domain.endsWith('.');
    } catch (_) {
      return false;
    }
  }, { message: 'Invalid domain format (e.g., example.com)' }),
});

export default function Home() {
  const [subdomains, setSubdomains] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [scannedDomain, setScannedDomain] = React.useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      domain: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setError(null);
    setSubdomains([]); // Clear previous results
    setScannedDomain(data.domain); // Store the domain being scanned

    const result: ScanResult = await scanSubdomains(data.domain);

    setIsLoading(false);

    if (result.success && result.data) {
      setSubdomains(result.data);
      if (result.data.length === 0) {
         toast({
            title: "Scan Complete",
            description: `No subdomains found for ${data.domain}.`,
         })
      } else {
         toast({
           title: "Scan Successful",
           description: `Found ${result.data.length} subdomains for ${data.domain}.`,
         });
      }
    } else {
      setError(result.error ?? 'An unknown error occurred.');
      toast({
        variant: "destructive",
        title: "Scan Failed",
        description: result.error ?? 'Could not retrieve subdomains.',
      });
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-background text-foreground">
      <Card className="w-full max-w-2xl shadow-lg border-accent/30 bg-background/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            {/* Neon Terminal Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent h-8 w-8">
                <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <g style={{ filter: 'url(#neon-glow)' }}>
                    <polyline points="4 17 10 11 4 5"></polyline>
                    <line x1="12" y1="19" x2="20" y2="19"></line>
                </g>
            </svg>
            <CardTitle className="text-3xl font-bold text-accent tracking-wider" style={{ textShadow: '0 0 5px hsl(var(--accent)), 0 0 10px hsl(var(--accent))' }}>
              Subdomain Finder
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Enter a domain to discover its subdomains.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Domain</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="e.g. google.com" // Updated placeholder
                          {...field}
                          className="h-12 text-lg pl-4 pr-28 border-accent/50 focus:ring-accent focus:ring-offset-background focus:border-accent bg-secondary/50"
                          disabled={isLoading}
                          aria-label="Domain to scan"
                        />
                        <Button
                          type="submit"
                          className="absolute right-1 top-1 h-10 px-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors duration-200 ease-in-out shadow-[0_0_10px_hsl(var(--accent))]"
                          disabled={isLoading}
                          aria-live="polite"
                        >
                          {isLoading ? (
                            <LoaderCircle className="h-5 w-5 animate-spin" />
                          ) : (
                            <Scan className="h-5 w-5" />
                          )}
                           <span className="ml-2 hidden sm:inline">Scan</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive/80 pt-1" />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <div className="mt-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-accent">
              <Terminal className="h-5 w-5" />
              Results {scannedDomain && `for ${scannedDomain}`}
            </h2>
            {/* Container for the results area */}
            <div className="bg-secondary/30 border border-accent/20 rounded-md p-4 min-h-[300px] shadow-inner">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground"> {/* Explicit height */}
                  <LoaderCircle className="h-8 w-8 animate-spin text-accent mb-4" />
                  <p>Scanning <span className="text-accent font-semibold">{scannedDomain || 'domain'}</span>...</p>
                  <p className="text-sm">(This might take a moment)</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-destructive/80 text-center"> {/* Explicit height */}
                  <ServerCrash className="h-8 w-8 mb-4" />
                  <p className="font-semibold">Error:</p>
                  <p>{error}</p>
                </div>
              ) : subdomains.length > 0 ? (
                 // Apply fixed height to ScrollArea to enable scrolling
                <ScrollArea className="h-[300px] w-full rounded-md">
                  <ul className="space-y-1 pr-4"> {/* Add padding-right to prevent text overlap with scrollbar */}
                    {subdomains.map((sub, index) => (
                      <li key={index} className="font-mono text-sm text-foreground/90 break-all hover:text-accent transition-colors duration-150">
                        <span className="text-accent/80 mr-1 select-none">&gt;</span> {sub}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              ) : (
                 // Empty state or initial state
                <div className="flex items-center justify-center h-[300px] text-muted-foreground text-center"> {/* Explicit height */}
                   <p>{scannedDomain ? `No subdomains found for ${scannedDomain}.` : 'Enter a domain and click Scan to see results.'}</p>
                </div>
              )}
            </div>
             {/* Results count - shown only when results are present */}
             { !isLoading && !error && subdomains.length > 0 && (
               <p className="text-right text-sm text-muted-foreground mt-2">
                 Found {subdomains.length} subdomains.
               </p>
             )}
          </div>
        </CardContent>
      </Card>
       <footer className="mt-8 text-center text-muted-foreground text-xs">
            @CELIKD
       </footer>
    </main>
  );
}
