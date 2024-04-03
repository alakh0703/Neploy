import Navbar from "../_components/navbar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full text-white">
            <Navbar />
            {children}
        </div>
    );
}
