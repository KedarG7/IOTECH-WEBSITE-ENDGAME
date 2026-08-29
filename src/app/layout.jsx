import { Space_Grotesk, Montserrat } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import InteractiveBackground from "@/components/InteractiveBackground";
import Navbar from "@/components/Navbar";
import LoadingProvider from "@/components/LoadingProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "IOTECH Club | College Tech Hub",
  description: "A student-driven technology community building ideas, skills, and experiences beyond the classroom. Explore workshops, hackathons, and innovative projects.",
  keywords: ["IOTECH", "Tech Club", "College Club", "Hackathons", "Workshops", "Robotics", "IoT", "AI/ML", "Web Development"],
  authors: [{ name: "IOTECH Club" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${montserrat.variable} min-h-full flex flex-col bg-background text-foreground custom-cursor-active`}
      >
        <InteractiveBackground />
        <CustomCursor />
        <LoadingProvider>
          <Navbar />
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
