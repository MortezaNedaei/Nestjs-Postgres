import * as Joi from '@hapi/joi';

export const ConfigModuleValidationSchema = Joi.object({
  DATABASE_HOST: Joi.required(),
  DATABASE_PASSWORD: Joi.required(),
  DATABASE_PORT: Joi.number().default(5432),
});
