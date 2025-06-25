import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-8 w-8 text-primary", className)}
      {...props}
    >
      <title>StockSphere Logo</title>
      <path d="M8 18V7.5a2.5 2.5 0 0 1 2.5-2.5h0A2.5 2.5 0 0 1 13 7.5v1" />
      <path d="M13 14v-1.5a2.5 2.5 0 0 1 2.5-2.5h0a2.5 2.5 0 0 1 2.5 2.5V18" />
      <path d="M3 18h18" />
      <path d="m18 12 3-3-3-3" />
    </svg>
  );
}
