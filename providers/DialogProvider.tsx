"use client";

import { Dialog, DialogButton } from "konsta/react";
import { createContext, ReactNode, useContext, useState } from "react";

interface DialogConfig {
  title?: string;
  content: string;
  type?: "alert" | "confirm";
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  disableBackdropClick?: boolean;
  cancelText?: string;
}

interface InputDialogConfig {
  title?: string;
  content?: string;
  placeholder?: string;
  defaultValue?: string;
  onConfirm?: (value: string) => void;
  onCancel?: () => void;
  confirmText?: string;
  disableBackdropClick?: boolean;
  cancelText?: string;
  maxLength?: number;
}

interface DialogContextType {
  showDialog: (config: DialogConfig) => void;
  showConfirm: (config: Omit<DialogConfig, "type">) => void;
  showAlert: (config: Omit<DialogConfig, "type">) => void;
  showInput: (config: InputDialogConfig) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [inputDialogOpened, setInputDialogOpened] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
    title: "",
    content: "",
    type: "alert",
    disableBackdropClick: false,
  });
  const [inputDialogConfig, setInputDialogConfig] = useState<InputDialogConfig>(
    {
      title: "",
      placeholder: "",
      defaultValue: "",
      disableBackdropClick: false,
    }
  );

  const showDialog = (config: DialogConfig) => {
    setDialogConfig(config);
    setDialogOpened(true);
  };

  const showAlert = (config: Omit<DialogConfig, "type">) => {
    showDialog({
      ...config,
      type: "alert",
    });
  };

  const showConfirm = (config: Omit<DialogConfig, "type">) => {
    showDialog({
      ...config,
      type: "confirm",
    });
  };

  const showInput = (config: InputDialogConfig) => {
    setInputDialogConfig(config);
    setInputValue(config.defaultValue || "");
    setInputDialogOpened(true);
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

  const handleInputConfirm = () => {
    if (inputDialogConfig.onConfirm) {
      inputDialogConfig.onConfirm(inputValue);
    }
    setInputDialogOpened(false);
    setInputValue("");
  };

  const handleInputCancel = () => {
    if (inputDialogConfig.onCancel) {
      inputDialogConfig.onCancel();
    }
    setInputDialogOpened(false);
    setInputValue("");
  };

  const renderButtons = () => {
    switch (dialogConfig.type) {
      case "confirm":
        return (
          <>
            <DialogButton onClick={handleCancel}>
              {dialogConfig.cancelText || "Cancel"}
            </DialogButton>
            <DialogButton strong onClick={handleConfirm}>
              {dialogConfig.confirmText || "OK"}
            </DialogButton>
          </>
        );
      case "alert":
      default:
        return (
          <DialogButton strong onClick={handleConfirm}>
            {dialogConfig.confirmText || "OK"}
          </DialogButton>
        );
    }
  };

  return (
    <DialogContext.Provider
      value={{ showDialog, showConfirm, showAlert, showInput }}
    >
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
        content={
          <div className="whitespace-pre-line">{dialogConfig.content}</div>
        }
        buttons={renderButtons()}
      />
      <Dialog
        opened={inputDialogOpened}
        onBackdropClick={() => {
          if (inputDialogConfig.disableBackdropClick) {
            return;
          }
          handleInputCancel();
        }}
        title={inputDialogConfig.title}
        content={
          <div className="space-y-4">
            {inputDialogConfig.content && (
              <div className="whitespace-pre-line text-sm text-gray-600">
                {inputDialogConfig.content}
              </div>
            )}
            <input
              type="text"
              placeholder={inputDialogConfig.placeholder}
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              maxLength={inputDialogConfig.maxLength}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  handleInputConfirm();
                }
              }}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        }
        buttons={
          <>
            <DialogButton onClick={handleInputCancel}>
              {inputDialogConfig.cancelText || "Cancel"}
            </DialogButton>
            <DialogButton strong onClick={handleInputConfirm}>
              {inputDialogConfig.confirmText || "OK"}
            </DialogButton>
          </>
        }
      />
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
