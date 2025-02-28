export class WhatsAppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "WhatsAppError";
  }
}

export function handleApiError(error: any): never {
  if (error.response) {
    const errorData = error.response.data.error;
    throw new WhatsAppError(
      errorData.message || 'Unknown WhatsApp API error',
      errorData.code,
      error.response.status,
      errorData.error_data || errorData.details
    );
  }
  
  if (error.request) {
    throw new WhatsAppError(
      'No response received from WhatsApp API',
      'NETWORK_ERROR',
      0,
      { request: error.request }
    );
  }
  
  throw new WhatsAppError(
    error.message || 'Unknown error occurred',
    'UNKNOWN_ERROR'
  );
}
