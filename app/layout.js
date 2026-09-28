import "./globals.css";




export const metadata = {
  title: "AfriCareer AI - Career & Academic Guidance for Africa",
  description:
    "AI-powered career and academic guidance for African youth and professionals: CV drafts, application letters, career planning, jobs, courses and scholarship discovery. Free during the pilot.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><a href="#main-content" className="skip-link">Skip to content</a>{children}</body>
    </html>
  );
}
