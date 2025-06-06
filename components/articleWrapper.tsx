import { ArticleWrapperProps } from "@/types";
import { cn } from "@/lib/utils";

export default function ArticleWrapper({
  children,
  className = "",
  style = null,
}: ArticleWrapperProps) {
  return (
    <div
      className={cn(
        "max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col",
        "min-h-screen",
        "justify-center min-h-screen app-font flex flex-col",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
