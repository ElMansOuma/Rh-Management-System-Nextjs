// C:\Users\DELL\Downloads\managerhr\project\components\ui\use-toast.tsx
// Version simplifiée pour cet exemple

import { createContext, useContext, useState } from "react";

type ToastVariant = "default" | "destructive";

type Toast = {
    title: string;
    description?: string;
    variant?: ToastVariant;
};

type ToastContextType = {
    toast: (props: Toast) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<(Toast & { id: number })[]>([]);

    const addToast = (toast: Toast) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { ...toast, id }]);

        // Supprimer le toast après 3 secondes
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`p-4 rounded-md shadow-md ${
                            toast.variant === "destructive" ? "bg-red-500 text-white" : "bg-white"
                        }`}
                    >
                        <div className="font-bold">{toast.title}</div>
                        {toast.description && <div>{toast.description}</div>}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

// Exporter pour faciliter l'utilisation
export const toast = (props: Toast) => {
    // Si utilisé en dehors du contexte, afficher en console
    console.log("Toast:", props.title, props.description);
};