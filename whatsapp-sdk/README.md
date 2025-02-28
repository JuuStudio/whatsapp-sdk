# WhatsApp SDK

## Overview
The WhatsApp SDK provides a simple and efficient way to interact with the WhatsApp API. It includes various functionalities that allow developers to send messages, manage contacts, and perform other operations seamlessly.

## Installation
To install the WhatsApp SDK, use npm:

```bash
npm install whatsapp-sdk
```

## Usage
Here is a basic example of how to use the WhatsApp SDK:

```typescript
import { WhatsAppClient } from 'whatsapp-sdk';

const client = new WhatsAppClient('your-api-key');

client.sendMessage('recipient-phone-number', 'Hello, World!')
  .then(response => {
    console.log('Message sent successfully:', response);
  })
  .catch(error => {
    console.error('Error sending message:', error);
  });
```

## API Reference
For detailed information on the available methods and classes, please refer to the documentation in the `src` directory.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.