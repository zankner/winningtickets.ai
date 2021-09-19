module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.winningtickets.cloud/api/:path*",
      },
    ];
  },
};
