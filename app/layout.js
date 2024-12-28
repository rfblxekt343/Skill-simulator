'use client'; // This is important to ensure this is a Client Component

import { Provider } from "react-redux";
import store from "../store/store";

import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Remove the metadata export from here
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="bg-green-100">
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
