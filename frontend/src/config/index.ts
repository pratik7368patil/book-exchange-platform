const config: any = {
  development: {
    url: "http://localhost:5001",
  },
  production: {
    url: "http://localhost:5001",
  },
};

export default config[process.env.NODE_ENV || "development"];
