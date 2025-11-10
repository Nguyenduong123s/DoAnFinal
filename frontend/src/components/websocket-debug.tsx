"use client";

import { useAppStore } from "@/components/app-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Wifi, WifiOff, Activity, Bug } from "lucide-react";

export default function WebsocketDebug() {
  const socket = useAppStore((state) => state.socket);
  const [events, setEvents] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Listen to all table-related events for debugging
    const handleTableStatusUpdated = (data: any) => {
      console.log("🔔 [DEBUG] table-status-updated:", data);
      setEvents((prev) => [
        ...prev.slice(-9),
        {
          type: "table-status-updated",
          data,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    };

    const handleNewOrder = (data: any) => {
      console.log("🔔 [DEBUG] new-order:", data);
      setEvents((prev) => [
        ...prev.slice(-9),
        {
          type: "new-order",
          data,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    };

    const handlePayment = (data: any) => {
      console.log("🔔 [DEBUG] payment:", data);
      setEvents((prev) => [
        ...prev.slice(-9),
        {
          type: "payment",
          data,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    };

    const handleUpdateOrder = (data: any) => {
      console.log("🔔 [DEBUG] update-order:", data);
      setEvents((prev) => [
        ...prev.slice(-9),
        {
          type: "update-order",
          data,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    };

    socket.on("table-status-updated", handleTableStatusUpdated);
    socket.on("new-order", handleNewOrder);
    socket.on("payment", handlePayment);
    socket.on("update-order", handleUpdateOrder);

    return () => {
      socket.off("table-status-updated", handleTableStatusUpdated);
      socket.off("new-order", handleNewOrder);
      socket.off("payment", handlePayment);
      socket.off("update-order", handleUpdateOrder);
    };
  }, [socket]);

  const testWebsocket = async () => {
    try {
      const response = await fetch("/api/test/test-websocket");
      const result = await response.json();
      console.log("Websocket test response:", result);
    } catch (error) {
      console.error("Websocket test error:", error);
    }
  };

  const debugTable = async (tableNumber: number) => {
    try {
      const response = await fetch(`/api/test/debug-table/${tableNumber}`);
      const result = await response.json();
      console.log(`Debug table ${tableNumber}:`, result);
    } catch (error) {
      console.error(`Debug table ${tableNumber} error:`, error);
    }
  };

  const forceUpdateTable = async (tableNumber: number) => {
    try {
      const response = await fetch(
        `/api/test/force-update-table/${tableNumber}`,
        {
          method: "POST",
        }
      );
      const result = await response.json();
      console.log(`Force update table ${tableNumber}:`, result);
    } catch (error) {
      console.error(`Force update table ${tableNumber} error:`, error);
    }
  };

  const testGuestLogin = async () => {
    try {
      const testLoginData = {
        name: "Test User",
        tableNumber: 4,
        token: "03c96f6f3c6c4d5a90e36961db2a2937",
      };

      const response = await fetch("/api/guest/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testLoginData),
      });

      const result = await response.json();
      console.log("🧪 Test Guest Login:", result);

      if (response.ok) {
        setEvents((prev) => [
          ...prev.slice(-9),
          {
            type: "test-guest-login-success",
            data: result,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } else {
        setEvents((prev) => [
          ...prev.slice(-9),
          {
            type: "test-guest-login-error",
            data: result,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Test guest login error:", error);
      setEvents((prev) => [
        ...prev.slice(-9),
        {
          type: "test-guest-login-error",
          data: {
            error: error instanceof Error ? error.message : "Unknown error",
          },
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
      >
        <Bug className="h-4 w-4 mr-2" />
        Debug
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-96 overflow-auto z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Websocket Debug
          </CardTitle>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {socket?.connected ? (
            <>
              <Wifi className="h-4 w-4 text-green-600" />
              <Badge variant="outline" className="text-green-600">
                Connected
              </Badge>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-red-600" />
              <Badge variant="outline" className="text-red-600">
                Disconnected
              </Badge>
            </>
          )}
        </div>

        {/* Debug Actions */}
        <div className="space-y-2">
          <Button onClick={testWebsocket} size="sm" className="w-full">
            Test Websocket
          </Button>
          <div className="grid grid-cols-2 gap-1">
            <Button onClick={() => debugTable(1)} size="sm" variant="outline">
              Debug Table 1
            </Button>
            <Button onClick={() => debugTable(2)} size="sm" variant="outline">
              Debug Table 2
            </Button>
            <Button
              onClick={() => forceUpdateTable(1)}
              size="sm"
              variant="secondary"
            >
              Force Table 1
            </Button>
            <Button
              onClick={() => forceUpdateTable(2)}
              size="sm"
              variant="secondary"
            >
              Force Table 2
            </Button>
            <Button
              onClick={testGuestLogin}
              size="sm"
              variant="destructive"
              className="col-span-2"
            >
              Test Guest Login Table 4
            </Button>
          </div>
        </div>

        {/* Recent Events */}
        <div>
          <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Recent Events ({events.length})
          </h4>
          <div className="space-y-1 max-h-32 overflow-auto">
            {events.length === 0 ? (
              <p className="text-xs text-gray-500">No events yet...</p>
            ) : (
              events.map((event, index) => (
                <div key={index} className="text-xs p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {event.type}
                    </Badge>
                    <span className="text-gray-500">{event.timestamp}</span>
                  </div>
                  <pre className="mt-1 text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(event.data, null, 1)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
