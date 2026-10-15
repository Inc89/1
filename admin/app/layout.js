import "./globals.css";

export const metadata = { title: "Контент завод — админка" };

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
