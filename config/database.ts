export default ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "127.0.0.1"),
      port: env.int("DATABASE_PORT", 3306),
      database: env("DATABASE_NAME", "academia_dahilmar_saez"),
      user: env("DATABASE_USERNAME", "root"),
      password: env("DATABASE_PASSWORD", ""),
      charset: env("DATABASE_CHARSET", "utf8mb4"),
      ssl: env.bool("DATABASE_SSL", false)
        ? {
            rejectUnauthorized: false,
          }
        : false,
      acquireConnectionTimeout: 5000,
      pool: {
        min: 0,
        max: 10,
        createTimeoutMillis: 8000,
        acquireTimeoutMillis: 8000,
        idleTimeoutMillis: 8000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
      },
    },
  },
});
