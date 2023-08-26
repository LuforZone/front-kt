/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // 匹配所有以 /api/ 开头的请求
        destination: 'http://localhost:8080/:path*', // 转发到后端的地址
      },
    ];
  },
};
