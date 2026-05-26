function responseTime(req, res, next) {
  const inicio = Date.now();

  // O evento 'finish' dispara quando a resposta é enviada
  res.on("finish", () => {
    const duracao = Date.now() - inicio;
    console.log(`[${req.method} ${req.url}] ${res.statusCode} - ${duracao}ms`);
  });

  next();
}

module.exports = responseTime;
