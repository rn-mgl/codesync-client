const REQUIRED_ENV = ["APP_URL", "SERVER_URL"] as const;

type EnvKeys = (typeof REQUIRED_ENV)[number];

const validateEnv = (): Record<EnvKeys, string> => {
  const env = {} as Record<EnvKeys, string>;

  for (const key of REQUIRED_ENV) {
    const value = process.env[key];

    if (value === undefined) {
      throw new Error(`Missing required env: ${key}`);
    }

    env[key] = value;
  }

  return env;
};

export const env = validateEnv();
