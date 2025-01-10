module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "ep-wispy-voice-a52c6dxj.us-east-2.aws.neon.tech",
      user: "neondb_owner",
      password: "iW5ODeH7vjCV",
      database: "neondb",
      ssl: { rejectUnauthorized: false }
    },
    migrations: {
      directory: "./migrations"
    },
    seeds: {
      directory: "./seeds"
    }
  }
};
