// hooks/useImageSelector.ts
import { Buffer } from "buffer";
import { useEffect, useState } from "react";
import api from "../api";

export const useImageSelector = (selector: string) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadImage = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `images/imageSelectors/${selector}`,
          { responseType: "arraybuffer" }
        );

        const base64 = Buffer.from(res.data, "binary").toString("base64");

        if (mounted) setImage(base64);
      } catch (e) {
        console.log("Image load failed", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadImage();

    return () => {
      mounted = false;
    };
  }, [selector]);

  return { image, loading };
};
