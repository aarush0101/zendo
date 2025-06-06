"use client";

import { toast } from "sonner";
import { X } from "lucide-react";
import { FaCircleInfo } from "react-icons/fa6";
import type React from "react";
import { useRef, useLayoutEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DynamicToastContentProps, ToastStyle, ToasterProps } from "@/types";

function DynamicToastContent({
  message,
  icon,
  onDismiss,
  iconColor,
  hoverAndFocus,
  action,
}: DynamicToastContentProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldWrap, setShouldWrap] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useLayoutEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const measureAndDecide = () => {
      const textElement = textRef.current!;

      // Get the viewport width
      const viewportWidth = window.innerWidth;

      // Calculate available space (accounting for padding, margins, close button, and action button)
      const bufferSpace = action ? 200 : 120; // More space if there's an action button
      const availableWidth = Math.min(viewportWidth - bufferSpace, 400);

      // Temporarily remove whitespace-nowrap to measure natural text width
      textElement.style.whiteSpace = "normal";
      textElement.style.width = "max-content";

      const textRect = textElement.getBoundingClientRect();
      const naturalTextWidth = textRect.width;

      // Reset styles
      textElement.style.whiteSpace = "";
      textElement.style.width = "";

      // Decide if we need to wrap
      const needsWrapping = naturalTextWidth > availableWidth;
      setShouldWrap(needsWrapping);
      setIsInitialized(true);
    };

    // Initial measurement
    measureAndDecide();

    // Re-measure on window resize
    const handleResize = () => {
      measureAndDecide();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [message, action]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "app-font flex items-start gap-2 w-full",
        // Hide content until measurement is complete to prevent flash
        !isInitialized && "opacity-0"
      )}
    >
      {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
      <div className="flex-1 min-w-0">
        <span
          ref={textRef}
          className={cn(
            "text-md block",
            shouldWrap ? "whitespace-normal break-words" : "whitespace-nowrap"
          )}
        >
          {message}
        </span>
        {action && (
          <button
            onClick={() => {
              action.onClick();
              onDismiss();
            }}
            className={cn(
              "mt-2 px-3 py-1 text-sm font-medium rounded transition-colors duration-200",
              "bg-blue-600 hover:bg-blue-700 text-white",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            )}
          >
            {action.label}
          </button>
        )}
      </div>
      <button
        onClick={onDismiss}
        className={cn(
          "flex-shrink-0 ml-2 rounded-[var(--radius)] p-1 transition-colors duration-300",
          hoverAndFocus
        )}
      >
        <X size="1.2rem" className={cn(iconColor)} />
      </button>
    </div>
  );
}

export default function sendToast({ type, message, action }: ToasterProps): void {
  const toastTypes = ["error", "success", "neutral", "warning"];
  if (!toastTypes.includes(type)) {
    console.error(
      `Failed to send toast. Toast type: "${type}" doesn't exist. Valid types: ${toastTypes.join(
        ", "
      )}`
    );
    return;
  }

  const toastStyles: Record<string, ToastStyle> = {
    error: {
      container:
        "relative inline-flex items-start gap-2 px-4 py-2.5 rounded-[var(--radius)] border border-rose-500 bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100 min-w-0 max-w-md",
      hoverAndFocus:
        "hover:bg-rose-200 dark:hover:bg-rose-800 focus:bg-rose-200 dark:focus:bg-rose-800",
      iconColor: "text-rose-600 dark:text-rose-300",
      toastFunction: toast.error,
    },
    success: {
      container:
        "relative inline-flex items-start gap-2 px-4 py-2.5 rounded-[var(--radius)] border border-green-500 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 min-w-0 max-w-md",
      hoverAndFocus:
        "hover:bg-green-200 dark:hover:bg-green-800 focus:bg-green-200 dark:focus:bg-green-800",
      iconColor: "text-green-600 dark:text-green-300",
      toastFunction: toast.success,
    },
    warning: {
      container:
        "relative inline-flex items-start gap-2 px-4 py-2.5 rounded-[var(--radius)] border border-orange-500 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 min-w-0 max-w-md",
      hoverAndFocus:
        "hover:bg-orange-200 dark:hover:bg-orange-800 focus:bg-orange-200 dark:focus:bg-orange-800",
      iconColor: "text-orange-600 dark:text-orange-300",
      toastFunction: toast.warning,
    },
    neutral: {
      container:
        "relative inline-flex items-start gap-2 px-4 py-2.5 rounded-[var(--radius)] border border-slate-400 bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100 min-w-0 max-w-md",
      hoverAndFocus:
        "hover:bg-slate-200 dark:hover:bg-slate-800 focus:bg-slate-200 dark:focus:bg-slate-800",
      iconColor: "text-slate-600 dark:text-slate-300",
      icon: <FaCircleInfo size="1.2rem" className="text-slate-600 dark:text-slate-400" />,
      toastFunction: toast,
    },
  };

  const { container, hoverAndFocus, iconColor, icon, toastFunction } = toastStyles[type];

  const toastId = toastFunction(
    <DynamicToastContent
      message={message}
      icon={icon}
      type={type}
      onDismiss={() => toast.dismiss(toastId)}
      iconColor={iconColor}
      hoverAndFocus={hoverAndFocus}
      action={action}
    />,
    {
      unstyled: true,
      className: container,
      duration: action ? 10000 : 4000, // Longer duration if there's an action
    }
  );
}
