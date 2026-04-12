// hooks/useImageSelector.ts
import { Buffer } from "buffer";
import { useEffect, useState } from "react";
import api from "../api";

export const useImageSelector = (selector: string, token?: string | null) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Capture the stack trace synchronously to survive the async boundary
  const callerStack = new Error().stack;

  useEffect(() => {
    let mounted = true;
    const loadImage = async () => {
      setLoading(true);
      try {
        console.log(`Loading image for selector: ${selector}`);
        const res = await api.get(
          `images/imageSelectors/${selector}`,
          { 
            responseType: "arraybuffer",
            headers: token ? { token } : undefined
          }
        );
        const base64 = Buffer.from(res.data, "binary").toString("base64");

        if (mounted) setImage(base64);
      } catch (e) {
        console.log("Image load failed", e);
        console.log("Original hook caller stack trace:", callerStack);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadImage();

    return () => {
      mounted = false;
    };
  }, [selector, token]);

  return { image, loading };
};
