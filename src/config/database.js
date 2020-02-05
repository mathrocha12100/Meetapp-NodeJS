module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  port: '5433',
  username: 'postgres',
  password: '123',
  database: 'meetappdatabase',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
