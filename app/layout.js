import './globals.css'

export const metadata = {
  title: 'PartiFy - AI Car Damage Detection',
  description: 'Upload car images, detect damage with AI, get instant repair quotes on WhatsApp',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚗</text></svg>" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
