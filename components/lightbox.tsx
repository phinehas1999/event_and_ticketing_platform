"use client";

import React, { useState } from "react";

export default function Lightbox({ src, alt }: { src: string; alt?: string }) {
  const [open, setOpen] = useState(false);
  if (!src) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="underline text-indigo-400"
      >
        View image
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt || "image"}
            className="max-w-[95%] max-h-[95%] object-contain rounded"
          />
        </div>
      )}
    </>
  );
}
