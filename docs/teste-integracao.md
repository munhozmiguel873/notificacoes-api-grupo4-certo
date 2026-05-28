# Teste de Integração — Bloco 4

**Data:** [28/05/2026]

**Testador:** [Pedro Augusto]

### Roteiro de Testes

| #  | Teste                                             | Resultado |  |
| -- | ------------------------------------------------- | --------- | ---------- |
| 1  | GET `/eventos` (seed)                             | ✅      |        
| 2  | POST `/eventos`                                   | ✅    
| 3  | POST `/participantes`                             | ✅          
| 4  | POST `/inscricoes`                                | ✅ 
| 5  | Verificação de e-mail no MailPit                  | ✅ 
| 6  | GET `/notificacoes`                               | ✅ 
| 7  | Teste de inscrição duplicada                      | ✅ 
| 8  | PATCH `/inscricoes/:id/cancelar`                  | ✅ 
| 9  | Verificação de e-mail de cancelamento             | ✅ 
| 10 | GET `/notificacoes/estatisticas`                  | ✅ 
| 11 | POST `/notificacoes/1/reenviar`                   | ✅ 
| 12 | GET `/exportar/eventos/xml`                       | ✅
| 13 | GET `/exportar/relatorio/inscricoes`              | ✅
| 14 | POST `/eventos/2/banner`                          | ✅
| 15 | GET `/api-docs`                                   | ✅
| 16 | Reinício do servidor (`Ctrl + C` + `npm run dev`) | ✅
| 17 | Persistência após reinício                        | ✅ 


**Problemas encontrados:**

- Erro de conexão com o servidor, corrigido reiniciando o servidor.

**Correções feitas:**

- Nenhuma correção necessária, todos os testes passaram com sucesso após reiniciar o servidor.