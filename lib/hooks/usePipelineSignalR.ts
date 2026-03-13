"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
  type HubConnection,
} from "@microsoft/signalr";
import { API_URL, AUTH_TOKEN_KEY } from "@/lib/env";

export interface StageChangedEvent {
  sessionId: string;
  stageName: string;
  status: string;
  message: string | null;
}

/**
 * Connects to the PipelineProgressHub via SignalR for real-time stage updates.
 * Falls back to polling automatically if SignalR fails to connect.
 *
 * @param sessionId - The AR analysis session ID to subscribe to.
 * @param onStageChanged - Called whenever the backend pushes a stage update.
 * @returns `{ connected }` — true when SignalR is active (false = polling fallback).
 */
export function usePipelineSignalR(
  sessionId: string | null,
  onStageChanged: (event: StageChangedEvent) => void
) {
  const [connected, setConnected] = useState(false);
  const connectionRef = useRef<HubConnection | null>(null);
  const onStageChangedRef = useRef(onStageChanged);
  onStageChangedRef.current = onStageChanged;

  useEffect(() => {
    if (!sessionId) return;

    const hubUrl = `${API_URL.replace(/\/$/, "")}/hubs/pipeline-progress`;
    const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token ?? "",
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    connection.on("StageChanged", (event: StageChangedEvent) => {
      onStageChangedRef.current(event);
    });

    connection.onreconnected(() => {
      setConnected(true);
      connection.invoke("JoinSession", sessionId).catch(() => {});
    });

    connection.onclose(() => {
      setConnected(false);
    });

    connection
      .start()
      .then(() => {
        setConnected(true);
        return connection.invoke("JoinSession", sessionId);
      })
      .catch(() => {
        setConnected(false);
      });

    return () => {
      connection.stop();
      connectionRef.current = null;
    };
  }, [sessionId]);

  return { connected };
}
