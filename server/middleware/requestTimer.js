export const requestTimer = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;

    console.log(`${method} ${url} → ${status} | ${duration}ms`);

    if (duration > 500) {
      console.warn(`⚠️  SLOW REQUEST: ${method} ${url} took ${duration}ms`);
    }
  });

  next();
};