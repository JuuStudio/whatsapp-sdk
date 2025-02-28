import { createBot, handleWebhook, verifyWebhook } from '../index';
import { WhatsAppError } from '../utils/errors';

// Example of creating a bot with configuration
const bot = createBot({
  token: process.env.WHATSAPP_TOKEN!,
  numberId: process.env.WHATSAPP_NUMBER_ID!,
  apiVersion: 'v22.0', // optional, defaults to v22.0
});

// Example of handling webhooks with error handling
async function handleIncomingWebhook(payload: any) {
  try {
    const { messages, statuses, contacts } = handleWebhook(payload);

    // Process messages with type checking
    for (const message of messages) {
      switch (message.type) {
        case 'text':
          // Handle text messages
          console.log(`Received text: ${message.text?.body}`);
          // Echo back the message
          await bot.sendText(message.from, `You said: ${message.text?.body}`);
          break;

        case 'image':
          // Handle image messages
          console.log(`Received image: ${message.image?.id}`);
          // Send a response
          await bot.sendText(message.from, 'Thanks for the image!');
          break;

        case 'interactive':
          // Handle button responses
          if (message.interactive?.type.button_reply) {
            const reply = message.interactive.type.button_reply;
            console.log(`Button clicked: ${reply.title} (${reply.id})`);
          }
          // Handle list responses
          else if (message.interactive?.type.list_reply) {
            const reply = message.interactive.type.list_reply;
            console.log(`List item selected: ${reply.title} (${reply.id})`);
          }
          break;

        case 'location':
          // Handle location messages
          console.log(
            `Received location: ${message.location?.latitude}, ${message.location?.longitude}`
          );
          break;

        default:
          console.log(`Received message of type: ${message.type}`);
      }
    }

    // Process status updates
    for (const status of statuses) {
      console.log(`Message ${status.id} status: ${status.status}`);
      // Handle different status types
      switch (status.status) {
        case 'sent':
          console.log('Message was sent');
          break;
        case 'delivered':
          console.log('Message was delivered');
          break;
        case 'read':
          console.log('Message was read');
          break;
      }

      // Log conversation origin
      if (status.conversation) {
        console.log(`Conversation type: ${status.conversation.origin.type}`);
      }
    }

    // Process contact information
    for (const contact of contacts) {
      console.log(`Contact: ${contact.profile.name} (${contact.wa_id})`);
    }
  } catch (error) {
    if (error instanceof WhatsAppError) {
      console.error('WhatsApp API Error:', error.message);
      console.error('Error Code:', error.code);
      console.error('Error Details:', error.details);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

// Example of sending different types of messages
async function sendExampleMessages(to: string) {
  try {
    // Send text message
    await bot.sendText(to, 'Hello! Here are some examples of what I can do:');

    // Send an image
    await bot.sendImage(to, {
      link: 'https://example.com/image.jpg',
      caption: 'Check out this image!',
    });

    // Send interactive buttons
    await bot.sendInteractiveButtons(to, {
      body: 'Please choose an option:',
      buttons: [
        { title: 'Option 1' },
        { title: 'Option 2' },
        { title: 'Option 3' },
      ],
    });

    // Send a list
    await bot.sendInteractiveList(to, {
      body: 'Here are some items:',
      buttonText: 'View Items',
      sections: [
        {
          title: 'Section 1',
          rows: [
            { id: 'item1', title: 'Item 1', description: 'Description 1' },
            { id: 'item2', title: 'Item 2', description: 'Description 2' },
          ],
        },
        {
          title: 'Section 2',
          rows: [
            { id: 'item3', title: 'Item 3', description: 'Description 3' },
            { id: 'item4', title: 'Item 4', description: 'Description 4' },
          ],
        },
      ],
    });

    // Send a location
    await bot.sendLocation(to, {
      latitude: 37.422,
      longitude: -122.084,
      name: 'Googleplex',
      address: '1600 Amphitheatre Parkway',
    });

  } catch (error) {
    if (error instanceof WhatsAppError) {
      console.error('WhatsApp API Error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

// Example of webhook verification
function verifyWebhookEndpoint(mode: string, token: string, challenge: string) {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN!;
  const result = verifyWebhook(mode, token, challenge, verifyToken);
  
  if (result) {
    return result; // Return challenge string if verification succeeds
  }
  throw new Error('Webhook verification failed');
}

export { handleIncomingWebhook, sendExampleMessages, verifyWebhookEndpoint };
