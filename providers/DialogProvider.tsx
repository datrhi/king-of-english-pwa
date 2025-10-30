"use client";

import { Dialog, DialogButton } from 'konsta/react';
import { createContext, ReactNode, useContext, useState } from 'react';

interface DialogConfig {
    title?: string;
    content: string;
    type?: 'alert' | 'confirm';
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    disableBackdropClick?: boolean;
    cancelText?: string;
}

interface DialogContextType {
    showDialog: (config: DialogConfig) => void;
    showConfirm: (config: Omit<DialogConfig, 'type'>) => void;
    showAlert: (config: Omit<DialogConfig, 'type'>) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
    const [dialogOpened, setDialogOpened] = useState(false);
    const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
        title: '',
        content: '',
        type: 'alert',
        disableBackdropClick: false,
    });

    const showDialog = (config: DialogConfig) => {
        setDialogConfig(config);
        setDialogOpened(true);
    };

    const showAlert = (config: Omit<DialogConfig, 'type'>) => {
        showDialog({
            ...config,
            type: 'alert',
        });
    };

    const showConfirm = (config: Omit<DialogConfig, 'type'>) => {
        showDialog({
            ...config,
            type: 'confirm',
        });
    };

    const handleConfirm = () => {
        if (dialogConfig.onConfirm) {
            dialogConfig.onConfirm();
        }
        setDialogOpened(false);
    };

    const handleCancel = () => {
        if (dialogConfig.onCancel) {
            dialogConfig.onCancel();
        }
        setDialogOpened(false);
    };

    const renderButtons = () => {
        switch (dialogConfig.type) {
            case 'confirm':
                return (
                    <>
                        <DialogButton onClick={handleCancel}>
                            {dialogConfig.cancelText || 'Cancel'}
                        </DialogButton>
                        <DialogButton strong onClick={handleConfirm}>
                            {dialogConfig.confirmText || 'OK'}
                        </DialogButton>
                    </>
                );
            case 'alert':
            default:
                return (
                    <DialogButton strong onClick={handleConfirm}>
                        {dialogConfig.confirmText || 'OK'}
                    </DialogButton>
                );
        }
    };

    return (
        <DialogContext.Provider value={{ showDialog, showConfirm, showAlert }}>
            {children}
            <Dialog
                opened={dialogOpened}
                onBackdropClick={() => {
                    if (dialogConfig.disableBackdropClick) {
                        return;
                    }
                    setDialogOpened(false);
                }}
                title={dialogConfig.title}
                content={dialogConfig.content}
                buttons={renderButtons()}
            />
        </DialogContext.Provider>
    );
}

export function useDialog() {
    const context = useContext(DialogContext);
    if (context === undefined) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
}

