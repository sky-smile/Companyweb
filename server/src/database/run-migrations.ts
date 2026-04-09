import 'reflect-metadata';
import AppDataSource from './data-source';

async function runMigrations(): Promise<void> {
  await AppDataSource.initialize();

  try {
    await AppDataSource.runMigrations();
  } finally {
    await AppDataSource.destroy();
  }
}

void runMigrations();
