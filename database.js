module.exports = {
    host : 'ec2-174-129-255-59.compute-1.amazonaws.com',
    database: 'ddmvjabo1n0v5c',
    user: 'qagaajhlfsvfsd',
    password: '7adf4acaa755003c51d1f01a5b4628170505638cc03114dd8a99d2403259c109',
    port: 5432,
    ssl: true,
    max: 20, // set pool max size to 20
    min: 4, // set min pool size to 4
    idleTimeoutMillis: 10000, // close idle clients after 1 second
    connectionTimeoutMillis: 10000, // return an error after 1 second if connection could not be established
  }