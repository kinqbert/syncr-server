import "dotenv/config";

import Joi from "joi";

const envSchema = Joi.object({
  PORT: Joi.number().default(5050),
  DATABASE_URL: Joi.string().required(),
})
  .unknown()
  .required();

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
}

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

const envVars = value as EnvVars;

export const CONFIG = {
  PORT: envVars.PORT || 5050,
  DATABASE_URL: envVars.DATABASE_URL,
};
