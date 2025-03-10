# @juutech/whatsapp-sdk

A modern TypeScript SDK for the WhatsApp Business Cloud API (v22.0). This SDK provides an easy-to-use interface for sending messages and handling webhooks with full TypeScript support.

[![npm version](https://img.shields.io/npm/v/@juutech/whatsapp-sdk.svg)](https://www.npmjs.com/package/@juutech/whatsapp-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 Full TypeScript support
- 📝 Easy message sending (text, media, interactive buttons, lists)
- 🔄 Webhook handling and verification
- 💪 Built-in error handling
- 📦 Zero external dependencies (except axios)

## Installation

```bash
npm install @juutech/whatsapp-sdk
```

## Quick Start

```typescript
import { createBot, verifyWebhook, handleWebhook } from "@juutech/whatsapp-sdk";

// Create a WhatsApp client
const whatsapp = createBot({
  token: "your-whatsapp-token",
  numberId: "your-phone-number-id",
});

// Send a text message
await whatsapp.sendText("1234567890", "Hello, World!");

// Handle webhook verification
app.get("/webhook", (req, res) => {
  const result = verifyWebhook({
    mode: req.query["hub.mode"],
    token: req.query["hub.verify_token"],
    challenge: req.query["hub.challenge"],
    verifyToken: "your-verify-token"
  });

  if (result) {
    res.send(result);
  } else {
    res.sendStatus(401);
  }
});

// Handle incoming webhooks
app.post("/webhook", (req, res) => {
  const { messages, statuses, contacts } = handleWebhook(req.body);

  // Handle messages
  for (const message of messages) {
    console.log(`Received message: ${message.type}`);
    // Access typed content based on message type
    if (message.type === "text") {
      console.log(`Text content: ${message.text?.body}`);
    }
  }

  res.sendStatus(200);
});
```

## Sending Messages

### Text Messages

```typescript
// Simple text message
await whatsapp.sendText("1234567890", "Hello!");

// With URL preview
await whatsapp.sendText("1234567890", "Check this: https://example.com", true);
```

### Media Messages

```typescript
// Send image
await whatsapp.sendImage("1234567890", {
  link: "https://example.com/image.jpg",
  caption: "Check out this image!",
});

// Send video
await whatsapp.sendVideo("1234567890", {
  link: "https://example.com/video.mp4",
  caption: "Watch this!",
});

// Send audio
await whatsapp.sendAudio("1234567890", {
  link: "https://example.com/audio.mp3",
});

// Send document
await whatsapp.sendDocument("1234567890", {
  link: "https://example.com/doc.pdf",
  caption: "Important document",
  filename: "document.pdf",
});

// Send sticker
await whatsapp.sendSticker("1234567890", {
  link: "https://example.com/sticker.webp",
});

### Media Utilities

```typescript
// Get media URL from message
const { url } = await getMediaUrl({
  mediaId: "media-id",
  accessToken: "your-access-token"
});

// Download media content
const buffer = await downloadMedia({
  mediaId: "media-id",
  accessToken: "your-access-token"
});

// You can also import directly from media subpath
import { getMediaUrl, downloadMedia } from "@juutech/whatsapp-sdk/media";
```

### Interactive Messages

```typescript
// Send buttons
await whatsapp.sendInteractiveButtons("1234567890", {
  body: "Please choose an option:",
  buttons: [{ title: "Yes" }, { title: "No" }, { title: "Maybe" }],
});

// Send list
await whatsapp.sendInteractiveList("1234567890", {
  body: "Available products:",
  buttonText: "View Products",
  sections: [
    {
      title: "Electronics",
      rows: [
        { id: "phone", title: "Smartphone", description: "Latest model" },
        { id: "laptop", title: "Laptop", description: "High performance" },
      ],
    },
  ],
});
```

### Location Messages

```typescript
await whatsapp.sendLocation("1234567890", {
  latitude: 37.422,
  longitude: -122.084,
  name: "Googleplex",
  address: "1600 Amphitheatre Parkway",
});
```

## Webhook Handling

The SDK provides robust webhook handling with proper typing:

```typescript
app.post("/webhook", (req, res) => {
  try {
    const { messages, statuses, contacts } = handleWebhook(req.body);

    // Handle messages
    for (const message of messages) {
      switch (message.type) {
        case "text":
          console.log(`Text message: ${message.text?.body}`);
          break;
        case "image":
          console.log(`Image message: ${message.image?.id}`);
          break;
        case "location":
          console.log(
            `Location: ${message.location?.latitude}, ${message.location?.longitude}`
          );
          break;
        // ... handle other types
      }
    }

    // Handle status updates
    for (const status of statuses) {
      console.log(`Message ${status.id} status: ${status.status}`);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook handling error:", error);
    res.sendStatus(500);
  }
});
```

## Error Handling

The SDK provides typed error handling:

```typescript
try {
  await whatsapp.sendText("1234567890", "Hello!");
} catch (error) {
  if (error instanceof WhatsAppError) {
    console.error(`WhatsApp API error: ${error.message}`);
    // Access error details
    console.error(`Code: ${error.code}`);
    console.error(`Details: ${error.details}`);
  }
}
```

## Development

### Testing

This package uses Jest for testing. The Jest configuration has been set up to handle ES modules properly, particularly for the axios dependency. If you're contributing to this project, you can run the tests with:

```bash
npm test
```

### Building

To build the package, run:

```bash
npm run build
```

This will compile the TypeScript files to JavaScript in the `dist` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
Contributions are welcome! Please feel free to submit a Pull Request.

## Public Package

This package is published as a public scoped package on npm. You can install it using:

```bash
npm install @juutech/whatsapp-sdk
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2024 Juu Studio
Copyright (c) 2024 WhatsApp Cloud SDK Contributors
