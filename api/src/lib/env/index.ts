import { Response } from 'express';

// ---- Success response helper ----
export let sendSuccessResponse = (res: Response, statusCode: number, message: string, data?: any): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
  });
};

// ---- Error response helper ----
export let sendErrorResponse = (res: Response, statusCode: number, message: string, errors?: any): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: errors ?? null,
  });
};

// ---- Pagination helper ----
export let paginationResponse = (res: Response, message: string, data: any[], total: number, page: number, limit: number): Response => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};
