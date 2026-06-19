import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Table } from '@models/Table';
import { PaginationOptions } from '@interfaces/PaginationOptions.interface';

@Service()
export class TableService {
  @InjectRepository(Table)
  private tableRepository: Repository<Table>;

  // ---- Get all tables ----
  async getAllTables(options: PaginationOptions): Promise<{ data: Table[]; total: number }> {
    let { page, limit } = options;
    let offset = (page - 1) * limit;

    let [tableList, total] = await this.tableRepository
      .createQueryBuilder('t')
      .where('t.is_deleted = 0')
      .orderBy('t.table_number', 'ASC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data: tableList, total };
  }

  // ---- Get table by id ----
  async getTableById(tableId: number): Promise<Table> {
    let tableRecord = await this.tableRepository.findOne({
      where: { id: tableId, is_deleted: 0 },
    });

    if (!tableRecord) {
      throw new Error('Table not found');
    }

    return tableRecord;
  }

  // ---- Create table ----
  async createTable(data: { table_number: string; capacity: number }): Promise<Table> {
    let existing = await this.tableRepository.findOne({
      where: { table_number: data.table_number, is_deleted: 0 },
    });

    if (existing) {
      throw new Error('Table number already exists');
    }

    let newTable = this.tableRepository.create(data);
    return await this.tableRepository.save(newTable);
  }

  // ---- Update table ----
  async updateTable(tableId: number, data: Partial<Table>): Promise<Table> {
    let tableRecord = await this.getTableById(tableId);
    Object.assign(tableRecord, data);
    return await this.tableRepository.save(tableRecord);
  }

  // ---- Soft delete table ----
  async deleteTable(tableId: number): Promise<void> {
    let tableRecord = await this.getTableById(tableId);
    tableRecord.is_deleted = 1;
    await this.tableRepository.save(tableRecord);
  }
}
