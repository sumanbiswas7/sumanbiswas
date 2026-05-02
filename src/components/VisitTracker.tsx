"use client";
import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    fetch("/api/views", { method: "POST" });
  }, []);
  return null;
}
