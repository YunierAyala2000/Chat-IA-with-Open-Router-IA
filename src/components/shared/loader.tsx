import { cn } from "@/lib/utils";

interface LoaderProps {
  text?: string;
  fullScreen?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "dots" | "pulse";
  overlayOpacity?: "light" | "medium" | "dark";
}

export function Loader({
  text = "Cargando...",
  fullScreen = true,
  className,
  size = "md",
  variant = "default",
  overlayOpacity = "dark",
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const overlayClasses = {
    light: "bg-black/20 dark:bg-black/40 backdrop-blur-sm",
    medium: "bg-black/50 dark:bg-black/60 backdrop-blur-md",
    dark: "bg-black/80 dark:bg-black/85 backdrop-blur-lg",
  };

  const variants = {
    default: (
      <div className={cn("relative flex items-center justify-center", sizeClasses[size])}>
        <div className="absolute inset-0 animate-pulse rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-xl"></div>

        <div className="absolute inset-0 animate-spin rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 blur-sm"></div>

        <div className="absolute inset-1 flex items-center justify-center overflow-hidden rounded-lg bg-gray-900 shadow-2xl">
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 animate-bounce rounded-full",
                  i === 0 && "h-8 bg-cyan-500",
                  i === 1 && "animation-delay-100 h-10 bg-blue-500",
                  i === 2 && "animation-delay-200 h-12 bg-indigo-500",
                  i === 3 && "animation-delay-300 h-8 bg-purple-500",
                )}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>

          <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-transparent via-white/10 to-transparent"></div>
        </div>

        <div className="absolute -top-1 -left-1 h-2 w-2 animate-ping rounded-full bg-cyan-500" />
        <div className="animation-delay-150 absolute -top-1 -right-1 h-2 w-2 animate-ping rounded-full bg-purple-500" />
        <div className="animation-delay-300 absolute -bottom-1 -left-1 h-2 w-2 animate-ping rounded-full bg-blue-500" />
        <div className="animation-delay-450 absolute -right-1 -bottom-1 h-2 w-2 animate-ping rounded-full bg-indigo-500" />
      </div>
    ),

    minimal: (
      <div className="flex flex-col items-center gap-3">
        <div className={cn("relative", sizeClasses[size])}>
          <div className="absolute inset-0 rounded-full border-4 border-gray-200/30 dark:border-gray-700/30"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    ),

    dots: (
      <div className="flex items-center justify-center gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "animate-bounce rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg",
              size === "sm" && "h-2 w-2",
              size === "md" && "h-3 w-3",
              size === "lg" && "h-4 w-4",
            )}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    ),

    pulse: (
      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            "animate-pulse rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-xl",
            size === "sm" && "h-8 w-8",
            size === "md" && "h-12 w-12",
            size === "lg" && "h-16 w-16",
          )}
        />
      </div>
    ),
  };

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      {variants[variant]}
      {text && variant !== "dots" && (
        <p className={cn("animate-pulse font-medium text-white drop-shadow-lg", textSizes[size])}>{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center transition-all duration-300",
          overlayClasses[overlayOpacity],
        )}
      >
        {content}
      </div>
    );
  }

  return content;
}

export function LoadingOverlay({
  isLoading,
  children,
  text = "Cargando...",
  variant = "default",
  overlayOpacity = "dark",
}: {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
  variant?: LoaderProps["variant"];
  overlayOpacity?: LoaderProps["overlayOpacity"];
}) {
  if (!isLoading) return <>{children}</>;

  const overlayClasses = {
    light: "bg-black/20 dark:bg-black/40",
    medium: "bg-black/50 dark:bg-black/60",
    dark: "bg-black/80 dark:bg-black/85",
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "absolute inset-0 z-40 flex items-center justify-center rounded-lg backdrop-blur-sm",
          overlayClasses[overlayOpacity],
        )}
      >
        <Loader fullScreen={false} text={text} variant={variant} size="md" overlayOpacity={overlayOpacity} />
      </div>
      <div className="pointer-events-none opacity-30 blur-[1px] select-none">{children}</div>
    </div>
  );
}
