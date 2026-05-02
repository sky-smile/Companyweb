import { hashPassword, verifyPassword } from './password.util';

describe('password.util', () => {
  describe('hashPassword', () => {
    it('应该生成密码哈希', async () => {
      const hash = await hashPassword('test123');
      expect(hash).toBeDefined();
      expect(hash).not.toBe('test123');
      expect(hash.length).toBeGreaterThan(0);
    });

    it('相同密码应生成不同哈希（因为 salt 不同）', async () => {
      const hash1 = await hashPassword('test123');
      const hash2 = await hashPassword('test123');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('正确密码应返回 true', async () => {
      const hash = await hashPassword('test123');
      const result = await verifyPassword('test123', hash);
      expect(result).toBe(true);
    });

    it('错误密码应返回 false', async () => {
      const hash = await hashPassword('test123');
      const result = await verifyPassword('wrong', hash);
      expect(result).toBe(false);
    });
  });
});
