import { Request, Response } from 'express';
import { Service } from 'typedi';
import { TableService } from '@services/table.service';
import { sendSuccessResponse, sendErrorResponse, paginationResponse } from '@lib/env';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@config/param';

@Service()
export class TableController {
  constructor(private tableService: TableService) {}

  // ---- GET /api/v1/tables ----
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      let page  = parseInt((req.query.page  as string) || String(DEFAULT_PAGE),  10);
      let limit = parseInt((req.query.limit as string) || String(DEFAULT_LIMIT), 10);

      let { data, total } = await this.tableService.getAllTables({ page, limit });
      paginationResponse(res, 'Tables fetched', data, total, page, limit);
    } catch (err) {
      let error = err as Error;
      sendErrorResponse(res, 500, error.message);
    }
  };

  // ---- GET /api/v1/tables/:id ----
  getOne = async (req: Request, res: Response): Promise<void> => {
    try {
      let tableId = parseInt(req.params.id, 10);
      let tableRecord = await this.tableService.getTableById(tableId);
      sendSuccessResponse(res, 200, 'Table fetched', tableRecord);
    } catch (err) {
      let error = err as Error;
      sendErrorResponse(res, 404, error.message);
    }
  };

  // ---- POST /api/v1/tables ----
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      let { table_number, capacity } = req.body as { table_number: string; capacity: number };
      let newTable = await this.tableService.createTable({ table_number, capacity });
      sendSuccessResponse(res, 201, 'Table created', newTable);
    } catch (err) {
      let error = err as Error;
      sendErrorResponse(res, 400, error.message);
    }
  };

  // ---- PUT /api/v1/tables/:id ----
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      let tableId = parseInt(req.params.id, 10);
      let updatedTable = await this.tableService.updateTable(tableId, req.body as Partial<import('@models/Table').Table>);
      sendSuccessResponse(res, 200, 'Table updated', updatedTable);
    } catch (err) {
      let error = err as Error;
      sendErrorResponse(res, 400, error.message);
    }
  };

  // ---- DELETE /api/v1/tables/:id ----
  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      let tableId = parseInt(req.params.id, 10);
      await this.tableService.deleteTable(tableId);
      sendSuccessResponse(res, 200, 'Table deleted', null);
    } catch (err) {
      let error = err as Error;
      sendErrorResponse(res, 400, error.message);
    }
  };
}
