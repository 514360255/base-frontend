export default {
  dev: {
    '/api/': {
      target: 'http://localhost:8181',
      changeOrigin: true,
      // pathRewrite: { '^/api': '' },
    },
    '/uploads/': {
      target: 'http://localhost:8181',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/uploads/': '' },
    },
  },
};
