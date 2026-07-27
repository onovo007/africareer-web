import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "AfriCareer AI - Career & Academic Guidance for Africa",
  description:
    "AI-powered career and academic guidance for African youth and professionals: ATS CVs, researched cover and motivation letters, live jobs and scholarships, and verified courses - grounded in UNICEF, ILO, AfDB and UNESCO evidence.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
