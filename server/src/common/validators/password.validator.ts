import { registerDecorator, ValidationOptions } from 'class-validator';

/** 常见弱口令黑名单（全部小写比对） */
const WEAK_PASSWORDS = [
  'password', 'password123', 'admin', 'admin123', 'admin123456',
  '123456', '12345678', '123456789', '1234567890', '123456789a',
  'qwerty', 'qwerty123', 'abc123', 'abcdef', 'letmein',
  'welcome', 'welcome123', 'monkey', 'dragon', 'master',
  'iloveyou', 'trustno1', 'sunshine', 'princess',
];

/** 密码复杂度正则：至少包含大小写字母和数字 */
const PASSWORD_COMPLEXITY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

export function isWeakPassword(password: string): boolean {
  return WEAK_PASSWORDS.includes(password.toLowerCase());
}

export function checkPasswordComplexity(password: string): boolean {
  return PASSWORD_COMPLEXITY.test(password);
}

/**
 * 密码强度校验装饰器
 * 规则：长度 >= 10、包含大小写字母和数字、不在弱口令黑名单中
 */
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string' || value.length === 0) {
            return false;
          }
          if (value.length < 10) {
            return false;
          }
          if (!PASSWORD_COMPLEXITY.test(value)) {
            return false;
          }
          if (isWeakPassword(value)) {
            return false;
          }
          return true;
        },
        defaultMessage() {
          return '密码长度至少 10 位，必须包含大小写字母和数字，且不能使用常见弱口令';
        },
      },
    });
  };
}
