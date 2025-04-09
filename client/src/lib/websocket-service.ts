import { EventEmitter } from "events";

// MockWebSocket emulates WebSocket behavior using polling
class WebSocketService extends EventEmitter {
  private isConnected = false;
  private pollInterval: number = 3000;
  private timer: NodeJS.Timeout | null = null;
  private lastMessageId: number = 0;

  constructor() {
    super();
  }

  connect() {
    if (this.isConnected) return;

    this.isConnected = true;
    this.emit("open");

    // Start polling for new activities and updates
    this.poll();

    return this;
  }

  async poll() {
    try {
      // Fetch new activities since last poll
      const response = await fetch(`/api/poll?since=${this.lastMessageId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          data.messages.forEach((msg) => {
            this.emit("message", { data: JSON.stringify(msg) });
            if (msg.id > this.lastMessageId) {
              this.lastMessageId = msg.id;
            }
          });
        }
      }
    } catch (error) {
      console.error("Polling error:", error);
      this.emit("error", error);
    }

    // Schedule next poll
    this.timer = setTimeout(() => this.poll(), this.pollInterval);
  }

  send(data: any) {
    // Post the message to backend
    fetch("/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: typeof data === "string" ? data : JSON.stringify(data),
    }).catch((error) => this.emit("error", error));
  }

  close() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.isConnected = false;
    this.emit("close");
  }
}

export default WebSocketService;
