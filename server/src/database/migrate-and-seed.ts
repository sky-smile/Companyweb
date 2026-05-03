/**
 * 数据库迁移和种子脚本
 * 按顺序执行：迁移 -> 种子
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
  console.log('  数据库迁移和种子脚本');
  console.log('========================================\n');

  console.log('[1/2] 运行数据库迁移...');
  run('ts-node -r tsconfig-paths/register src/database/run-migrations.ts');

  console.log('\n[2/2] 运行种子脚本...');
  run('ts-node -r tsconfig-paths/register src/database/seeds/auth.seed.ts');

  console.log('\n========================================');
  console.log('  ✅ 数据库迁移和种子脚本执行成功！');
  console.log('========================================\n');
}

main();
