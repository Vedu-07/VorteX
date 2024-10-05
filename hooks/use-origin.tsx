import { useEffect, useState } from "react";
// This hook Is used to get the url of current window as it is gonna be used in Publish functionality
export const useOrigin = () => {
  const [mounted, setMounted] = useState(false);
  const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return "";
  }

  return origin;
};