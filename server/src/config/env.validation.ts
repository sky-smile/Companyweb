import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  SERVER_NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  SERVER_PORT: Joi.number().port().default(3000),
  SERVER_GLOBAL_PREFIX: Joi.string().default('api'),
  DB_TYPE: Joi.string().valid('mariadb', 'mysql').default('mariadb'),
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().port().default(3306),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').required(),
  DB_SYNCHRONIZE: Joi.boolean().truthy('true').falsy('false').default(false),
  DB_LOGGING: Joi.boolean().truthy('true').falsy('false').default(false),
  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('2h'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  UPLOAD_DIR: Joi.string().default('uploads'),
  UPLOAD_BASE_URL: Joi.string().uri().required(),
});
