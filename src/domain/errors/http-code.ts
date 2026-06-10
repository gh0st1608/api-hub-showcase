export enum HttpStatusResponse {
  // Exito - 2xx
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,

  // Errores del cliente - 4xx
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  
  // Errores del servidor - 5xx
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  VARIANT_ALSO_NEGOTIATES = 506,
}
