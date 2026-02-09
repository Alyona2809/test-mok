/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // В монорепе Next иногда неверно "угадывает" корень и ищет зависимости в родительской папке.
    // Это фиксирует root на `frontend/`, чтобы не падало с `Can't resolve 'tailwindcss'`.
    root: __dirname,
  },
};

module.exports = nextConfig;

