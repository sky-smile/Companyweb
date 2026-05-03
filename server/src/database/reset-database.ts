/**
 * 数据库重置脚本
 * 按顺序执行：删除所有表 -> 迁移 -> 种子
 */
import { execSync } from 'child_process';

function run(command: string): void {
  console.log(`\n> ${command}\n`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`\n命令执行失败: ${command}`);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  console.log('========================================');
  console.log('  ⚠️  数据库重置脚本');
  console.log('========================================\n');

  console.log('[1/3] 删除所有表...');
  run('typeorm-ts-node-commonjs schema:drop -d dist/database/data-source.js');

  console.log('\n[2/3] 运行数据库迁移...');
  run('ts-node -r tsconfig-paths/register src/database/run-migrations.ts');

  console.log('\n[3/3] 运行种子脚本...');
  run('ts-node -r tsconfig-paths/register src/database/seeds/auth.seed.ts');

  console.log('\n========================================');
  console.log('  ✅ 数据库重置完成！');
  console.log('========================================\n');
}

main();
