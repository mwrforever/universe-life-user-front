import { useCallback, useState, useRef } from "react";

interface UseFooterInteractionOptions {
  enableAnalytics?: boolean;
  longPressThreshold?: number;
  doubleClickThreshold?: number;
}

export const useFooterInteraction = (options: UseFooterInteractionOptions = {}) => {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [themeChanging, setThemeChanging] = useState(false);

  const handleHoverStart = useCallback((elementId: string) => {
    setHoveredElement(elementId);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setHoveredElement(null);
  }, []);

  const handleClick = useCallback((elementId: string, href: string, external = false) => {
    setActiveElement(elementId);
    console.log("Footer click:", { elementId, href, external });
    
    if (external && href !== "#") {
      window.open(href, "_blank");
    } else if (href !== "#") {
      window.location.href = href;
    }
    
    setTimeout(() => setActiveElement(null), 200);
  }, []);

  const handleLongPressStart = useCallback((elementId: string) => {
    console.log("Long press start:", elementId);
  }, []);

  const handleLongPressEnd = useCallback(() => {
    console.log("Long press end");
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent, elementId: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      console.log("Key down:", elementId);
    }
  }, []);

  const handleFocus = useCallback((elementId: string) => {
    setActiveElement(elementId);
  }, []);

  const handleBlur = useCallback(() => {
    setActiveElement(null);
  }, []);

  const isElementHovered = useCallback((elementId: string) => {
    return hoveredElement === elementId;
  }, [hoveredElement]);

  const isElementActive = useCallback((elementId: string) => {
    return activeElement === elementId;
  }, [activeElement]);

  return {
    hoveredElement,
    activeElement,
    isLoading,
    themeChanging,
    handleHoverStart,
    handleHoverEnd,
    handleClick,
    handleLongPressStart,
    handleLongPressEnd,
    handleKeyDown,
    handleFocus,
    handleBlur,
    isElementHovered,
    isElementActive,
  };
};
