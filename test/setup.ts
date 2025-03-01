import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Mock environment variables if not present
process.env.WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || 'test-token';
process.env.WHATSAPP_NUMBER_ID = process.env.WHATSAPP_NUMBER_ID || 'test-number-id';
process.env.VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'test-verify-token'; 