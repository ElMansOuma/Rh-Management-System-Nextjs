// app/(public)/layout.tsx
import '../home.css'

export default function PublicLayout({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {children}
        </div>
    );
}