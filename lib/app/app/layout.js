export const metadata = {
  title: 'Doctor Appointment System',
  description: 'Book doctor appointments easily',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
