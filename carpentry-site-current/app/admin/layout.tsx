import type { Metadata } from "next";

import AdminSidebar from "@/components/AdminSidebar";

export const metadata: Metadata = {
  title: "מערכת ניהול",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f5f4f1]"
    >
      <AdminSidebar />

      <div className="lg:mr-[290px]">
        {children}
      </div>
    </div>
  );
}