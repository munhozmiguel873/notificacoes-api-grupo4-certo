# Roteiro de Demo

## Preparação (antes da apresentação)
- [ ] Servidor rodando (npm run dev)
- [ ] Swagger aberto em http://localhost:3000/api-docs
- [ ] Postman com collection carregada
- [ ] MySQL Workbench aberto (para mostrar dados)
- [ ] Backup: API deployed no Render (caso a rede caia)

## Sequência da Demo
### 1. Visão geral (Swagger)
- Abrir /api-docs
- Mostrar as rotas organizadas por entidade

### 2. Criar um evento (Postman)
- POST /eventos com dados
- Mostrar resposta 201 com ID

### 3. Criar participante + inscrição
- POST /participantes
- POST /inscricoes ligando participante ao evento
- Mostrar validação de duplicata

### 4. Mostrar persistência
- Fechar e reabrir o servidor
- GET /eventos — dados ainda estão lá

### 5. Notificações (se implementado)
- Mostrar envio de e-mail simulado
- Mostrar histórico no banco

### 6. Mostrar no banco (MySQL Workbench)
- SELECT \* FROM eventos
- SELECT \* FROM inscricoes com JOIN