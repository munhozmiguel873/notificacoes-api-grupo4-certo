function baseTemplate(conteudo) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #2E75B6;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .body {
          padding: 30px;
          color: #333333;
          line-height: 1.6;
        }
        .footer {
          background-color: #f8f8f8;
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #888888;
          border-top: 1px solid #eeeeee;
        }
        .btn {
          display: inline-block;
          background-color: #2E75B6;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          margin: 10px 0;
        }
        .info-box {
          background-color: #f0f7ff;
          border-left: 4px solid #2E75B6;
          padding: 15px;
          margin: 15px 0;
          border-radius: 0 4px 4px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Plataforma de Eventos</h1>
        </div>
        <div class="body">
          ${conteudo}
        </div>
        <div class="footer">
          <p>Este é um e-mail automático. Por favor, não responda.</p>
          <p>&copy; 2025 Plataforma de Eventos — SENAI</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = baseTemplate;
