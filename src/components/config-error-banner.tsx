export function ConfigErrorBanner() {
    return (
        <div className="bg-background text-foreground flex items-center justify-center min-h-screen p-4 font-sans">
            <div className="bg-card border border-destructive/50 rounded-lg p-6 sm:p-8 max-w-3xl w-full shadow-2xl">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="mt-4 text-2xl font-bold text-destructive">Firebase Configuration Error</h2>
                </div>
                <div className="mt-6 text-card-foreground">
                    <p className="text-center mb-6">
                        Your application cannot connect to Firebase because its configuration is missing. Please follow the steps below to resolve this issue.
                    </p>
                    <div className="text-left text-sm bg-muted/50 p-4 rounded-md space-y-3 border border-border">
                        <p className="font-semibold text-base text-foreground">Step-by-Step Instructions:</p>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li>
                                In the file explorer on the left, find the file named <strong>.env.local.example</strong>.
                            </li>
                            <li>
                                Create a new file in the root of your project (the same folder as package.json) and name it exactly <strong>.env.local</strong>
                            </li>
                            <li>
                                Copy the entire contents from <strong>.env.local.example</strong> and paste them into your new <strong>.env.local</strong> file.
                            </li>
                            <li>
                                Replace the placeholder values with your actual Firebase project credentials. You can find these in the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Firebase Console</a>.
                            </li>
                            <li>
                                <strong>Important:</strong> After saving the file, you must <strong>restart the development server</strong> for the changes to take effect.
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}
