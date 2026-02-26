import { Metadata } from "next";

export const metadata: Metadata = {
  title: "View | Problem",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
