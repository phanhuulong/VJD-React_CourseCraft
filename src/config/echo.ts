import Echo from 'laravel-echo';

import Pusher from 'pusher-js';

// Khai báo biến `Pusher` trên `window`
export {};

declare global {
  interface Window {
    Pusher: any;
    Echo: any;
  }

  interface ImportMeta {
    env: {
      VITE_PUSHER_APP_KEY: string;
      VITE_PUSHER_APP_CLUSTER: string;
      VITE_PUSHER_HOST?: string;
      VITE_PUSHER_PORT?: string;
      VITE_PUSHER_SCHEME?: string;
    };
  }
}

window.Pusher = Pusher as any;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true
});