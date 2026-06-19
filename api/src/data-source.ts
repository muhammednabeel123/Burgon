import 'reflect-metadata';
import { DataSource, useContainer as typeormUseContainer } from 'typeorm';
import { Container } from 'typedi';
import config from '@config/config';

typeormUseContainer(Container);

export let AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.name,
  synchronize: false,
  logging: config.env === 'development',
  entities: [__dirname + '/models/**/*.ts'],
  migrations: [__dirname + '/migrations/**/*.ts'],
  subscribers: [],
});
