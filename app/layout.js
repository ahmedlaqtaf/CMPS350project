import "./globals.css";

export const metadata = {
  title: "Twizzle",
  description: "Twizzle social media platform with Prisma-backed APIs and analytics.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
