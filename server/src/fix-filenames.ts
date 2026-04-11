/**
 * 修复数据库中已有的中文文件名乱码
 * 
 * 运行方式:
 * pnpm run fix-filenames
 */

import * as mysql from 'mysql2/promise';

/**
 * 修复 Multer/busboy 的 Latin-1 误解析问题
 */
function fixFilenameEncoding(filename: string): string {
  try {
    if (/[\x80-\xFF]/.test(filename)) {
      const buffer = Buffer.from(filename, 'latin1');
      const decoded = buffer.toString('utf8');
      if (/[\u4e00-\u9fa5]/.test(decoded)) {
        return decoded;
      }
    }
  } catch {
    // 忽略
  }
  return filename;
}

async function bootstrap() {
  console.log('🔧 开始修复数据库中的中文文件名乱码...\n');

  // 连接数据库
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'company_web',
  });

  console.log('✅ 数据库连接成功\n');

  // 查询所有 media_files
  const [rows]: any = await connection.execute(
    'SELECT id, original_name FROM media_files'
  );

  let fixedCount = 0;

  for (const row of rows) {
    const originalName = row.original_name;
    const fixedName = fixFilenameEncoding(originalName);

    if (fixedName !== originalName) {
      console.log(`📝 修复: ${originalName} → ${fixedName}`);
      await connection.execute(
        'UPDATE media_files SET original_name = ? WHERE id = ?',
        [fixedName, row.id]
      );
      fixedCount++;
    }
  }

  console.log(`\n✅ 修复完成！共修复 ${fixedCount} 个文件名`);

  // 验证结果
  const [updatedRows]: any = await connection.execute(
    'SELECT id, original_name FROM media_files ORDER BY id DESC LIMIT 10'
  );
  
  console.log('\n📊 修复后的文件名列表：');
  updatedRows.forEach((row: any) => {
    console.log(`   ID: ${row.id} | 文件名: ${row.original_name}`);
  });

  await connection.end();
}

bootstrap().catch((err) => {
  console.error('❌ 修复失败:', err);
  process.exit(1);
});
