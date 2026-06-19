export enum PaymentStatus {
  PENDING   = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED    = 'FAILED',
  REFUNDED  = 'REFUNDED',
}

export enum PaymentProvider {
  TAP    = 'TAP',
  STRIPE = 'STRIPE',
  CASH   = 'CASH',
}
