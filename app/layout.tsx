import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import SessionProvider from "@/providers/SessionProvider";
import { getServerSession } from "next-auth";
import { Toaster } from "@/components/ui/toaster"
import { QueryProviders } from "@/providers/QueryProvider";
import { SessionProviderWrapper } from "@/providers/SessionContext";


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

export const metadata: Metadata = {
  title: "H-Helper | 당신만의 운동 도우미",
  description: "H-Helper와 함께 건강한 라이프스타일을 만들어보세요.",
  openGraph: {
    title: "H-Helper | 당신만의 운동 도우미",
    description: "H-Helper와 함께 건강한 라이프스타일을 만들어보세요.",
    url: "https://health-helper-app.vercel.app/",
    siteName: "H-Helper",
    images: [
      {
        url: "/opengraph-image", // 동적으로 생성된 이미지
        width: 1200,
        height: 630,
        alt: "H-Helper 메인 페이지",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "H-Helper | 당신만의 운동 도우미",
    description: "개인 맞춤형 운동 프로그램을 경험하세요.",
    images: ["/opengraph-image"], // 트위터에서도 동일한 동적 이미지 사용
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/dumbbell.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProviders>
          <SessionProvider>
            <SessionProviderWrapper session={session}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster />
              </ThemeProvider>
            </SessionProviderWrapper>
          </SessionProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
