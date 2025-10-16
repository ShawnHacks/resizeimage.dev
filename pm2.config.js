module.exports = {
  apps: [
    {
      name: "bulkresizeimages",
      script: "pnpm",
      args: "start",
      env_production: {
        NODE_ENV: "production",
        PORT: 8088,
      },
      instances: 2,     // 'max': 使用所有可用的 CPU 核心, 2: 使用 2 个进程
      exec_mode: 'cluster', // cluster: 使用集群模式, fork: 使用 fork 模式
    },
  ],
}

// pm2 start pm2.config.js --env production