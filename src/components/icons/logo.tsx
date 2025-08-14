import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8.7a4 4 0 1 0-8 0" />
      <path d="M16 15.3a4 4 0 1 1-8 0" />
      <path d="M4.7 12A8.1 8.1 0 0 0 12 20a8.1 8.1 0 0 0 7.3-8" />
      <path d="M19.3 12A8.1 8.1 0 0 0 12 4a8.1 8.1 0 0 0-7.3 8" />
    </svg>
  );
}
