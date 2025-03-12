
/// <reference types="vite/client" />

// Define the simli-widget custom element
declare namespace JSX {
  interface IntrinsicElements {
    'simli-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      token: string;
      agentid: string;
      position?: 'left' | 'right';
      eventname?: string;
      customtext?: string;
      customimage?: string;
    }, HTMLElement>;
  }
}
