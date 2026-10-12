function notFound(req, res, _next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, _req, res, _next) {
  console.error(err);
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Validation failed", details: Object.values(err.errors).map(e => e.message) });
  }
  if (err.code === 11000) return res.status(409).json({ message: "A record with that value already exists." });
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid resource ID." });
  res.status(err.statusCode || 500).json({
    message: err.statusCode ? err.message : "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
}

module.exports = { notFound, errorHandler };
