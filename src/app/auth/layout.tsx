export default function AuthLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <main>
            <div className="hero min-h-screen">
                <div className="hero-content text-center w-1/3">
                    <div className="w-full">
                        {children}
                    </div>
                </div>
            </div>
        </main>
    )
}