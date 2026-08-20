# Análise de Arquitetura da API

## Atividade 1 — Mapeamento das Camadas e Responsabilidades

| Camada | Arquivos encontrados | Responsabilidade |
|---|---|---|
| Rotas | auth.routes.js, notificacao.routes.js, evento.routes.js, participante.routes.js | Mapear o caminho e o verbo HTTP para um controller e aplicar middlewares. |
| Controllers | EventoController.js, InscricaoController.js, ParticipanteController.js | Controlar as operações de eventos, inscrições e participantes. |
| Services | EmailService.js, EventoService.js, InscricaoService.js, ParticipanteService.js, NotificacaoService.js | Implementar regras de negócio, orquestrar ações e integrar serviços externos. |
| Models | EventoModel.js, index.js, InscricaoModel.js, NotificacaoModel.js, ParticipanteModel.js | Comunicar-se com o banco de dados e definir a estrutura dos dados. |
| Middlewares | cacheMiddleware.js, errorHandler.js, logger.js, notFound.js, responseTime.js | Tratar cache, logs, erros e medir tempo de resposta. |
| Configuração / .env | cache.js, database.js, upload.js | Definir conexão com o banco, configuração de upload e outras variáveis de ambiente. |
| Outros (utils/helpers) | parseld.js, validators.js | Validar IDs e verificar se as requisições estão consistentes. |

### Pergunta e Resposta

#### 1. Quantos arquivos existem em cada camada?
- Rotas: 4 arquivos
- Controllers: 3 arquivos
- Services: 5 arquivos
- Models: 5 arquivos
- Middlewares: 5 arquivos
- Configuração / .env: 3 arquivos
- Outros: 2 arquivos

#### 2. As responsabilidades estão de fato separadas, ou existe camada fazendo o trabalho de outra?
As camadas estão em grande parte separadas, mas há um desvio leve na camada de notificação: existe o arquivo de rota e o serviço de notificação, porém não há um controller específico para esse módulo.

#### 3. Onde está a comunicação com o banco de dados?
A comunicação com o banco está centralizada em config/database.js.

#### 4. Onde está a comunicação com o serviço de e-mail (Nodemailer/MailPit)?
A comunicação com o MailPit está encapsulada no EmailService.js, e esse serviço é acionado pelos observers/serviços de notificação.

---

## Atividade 2 — Tabela de Mapeamento de Rotas

| # | Método | Caminho | Exige token? | Controller | Service | Model(s) | Efeito Colateral |
|---|---|---|---|---|---|---|---|
| 1 | POST | /auth/register | Não | ParticipanteController | listar | ParticipanteModel | Gera token |
| 2 | POST | /auth/login | Não | EventoController (ou Auth) | listar | ParticipanteModel | Acessa o app |
| 3 | GET | /eventos | Sim | EventoController | listarTodos | EventoModel | Mostra todos os eventos |
| 4 | POST | /eventos | Sim | EventoController | EventoService | EventoModel | Cria novos eventos |
| 5 | PUT | /eventos/:id | Sim | EventoController | criar | EventoModel | Atualiza um evento por ID |
| 6 | DELETE | /eventos/:id | Sim | EventoController | deletar | EventoModel | Deleta um evento por ID |
| 7 | POST | /eventos/:banner | Sim | EventoController | EventoService | EventoModel | Cria um banner |
| 8 | GET | /participantes | Não | ParticipanteController | ParticipanteService | ParticipanteModel | Mostra todos os participantes |
| 9 | GET | /participantes/:id | Não | ParticipanteController | ParticipanteService | ParticipanteModel | Mostra um participante por ID |
| 10 | POST | /participantes | Sim | ParticipanteController | atualizar | ParticipanteModel | Cria participantes |
| 11 | PUT | /participantes/:id | Não | ParticipanteController | listarTodos | ParticipanteModel | Atualiza um participante por ID |
| 12 | POST | /inscricoes | Sim | InscricaoController | listarPorEvento | InscricaoModel, EventoModel | Cria uma nova inscrição |
| 13 | GET | /inscricoes | Sim | InscricaoController | InscricaoService | InscricaoModel | Mostra todas as inscrições |
| 14 | GET | /inscricoes/evento/:eventoId | Sim | InscricaoController | InscricaoService | InscricaoModel, EventoModel | Mostra inscrições por evento |
| 15 | PATCH | /inscricoes/:id/cancelar | Sim | InscricaoController | InscricaoService | InscricaoModel | Cancela uma inscrição por ID |
| 16 | GET | /notificacoes | Sim | Sem ctrl | NotificacaoService | NotificacaoModel | Mostra todas as notificações |
| 17 | GET | /notificacoes/estatisticas | Não | Sem ctrl | NotificacaoService | NotificacaoModel | Mostra estatísticas |
| 18 | GET | /notificacoes/:id | Não | Sem ctrl | NotificacaoService | NotificacaoModel | Mostra uma notificação por ID |
| 19 | POST | /notificacoes/:id/reenviar | Não | Sem ctrl | NotificacaoService, EmailService | NotificacaoModel | Reenvia a notificação |
| 20 | POST | /notificacoes/teste-email | Não | Sem ctrl | EventoService | Nenhum | Envia um e-mail teste |
| 21 | GET | /exportar/eventos/xml | Não | EventoController | EventoService | EventoModel | Mostra os eventos em XML |
| 22 | GET | /exportar/eventos/json | Não | EventoController | EventoService | EventoModel | Mostra os eventos em JSON |
| 23 | GET | /exportar/relatorio/inscricoes | Não | InscricaoController | InscricaoService | InscricaoModel | Mostra um relatório de inscrições |

---

## Atividade 3 — Níveis de Teste

| Comportamento a verificar | Nível | Por que este nível |
|---|---|---|
| Login com credenciais válidas retorna token e status 200 | Unitário | Depende apenas dos dados de entrada e da lógica de autenticação. |
| Usuário tenta logar com senha incorreta e o sistema rejeita | Integração | Exige que o dado chegue ao banco e que o fluxo real funcione. |
| Criação de uma inscrição dispara e-mail de confirmação e grava a notificação no banco | Integração (interação) | Necessita da persistência real e da comunicação com o serviço externo. |
| Cadastro de evento com dados válidos retorna 201 e persiste o evento | Endpoint | Requer validação por HTTP e confirmação da persistência do recurso. |
| Fluxo completo: participante se inscreve em evento e recebe confirmação por e-mail | Aceitação | É um cenário end-to-end do negócio envolvendo várias camadas. |

---

## Parte 4 — Análise

### 4.1 Se uma funcionalidade falhasse silenciosamente em produção, qual causaria maior estrago?
A funcionalidade que causaria maior estrago seria a principal de cadastro e registro dos dados, porque o usuário poderia acreditar que as informações foram salvas quando, na verdade, não foram. Isso compromete a integridade dos dados e gera erros que podem ser difíceis de detectar.

### 4.2 Quais pontos do módulo dependem de algo externo ao código?
- Banco de dados
- Servidor de e-mail
- Relógio do sistema
- Variáveis de ambiente
- Conexão com a internet
- APIs e serviços externos

### 4.3 Função/regra de negócio pura
- Nome: listarTodos()
- Arquivo: src/services/EventoService.js
- Descrição: essa função é responsável por listar as opções disponíveis do usuário.

### 4.4 Existe alguma parte do módulo que vocês não sabem explicar?
Sim. Há uma parte que precisa ser melhor compreendida: o fluxo de comunicação com a API, especialmente o que acontece quando uma requisição falha ou retorna um resultado inesperado.

---

## Parte 5 — Desafio Extra

### Rota de maior risco
- Rota: POST /inscricoes
- Motivo: é uma operação crítica que envolve validação de vagas, checagem de duplicidade, atualização de status e integração com múltiplas tabelas e notificações.
- Impacto: pode causar overbooking, inconsistência de dados e disparo indevido de e-mails.

### Rota de menor risco
- Rota: GET /exportar/eventos/json
- Motivo: é uma operação somente de leitura, sem alteração no banco e sem regras de negócio muito complexas.
- Impacto: em caso de falha, o usuário apenas não recebe o arquivo, sem risco grave de perda de dados.

---

## Parte 1 — Matriz técnica × camada

| Camada / grupo de rotas | Regressão | Segurança | Recuperação | Performance | Estresse | Paralelo |
|---|---|---|---|---|---|---|
| Autenticação | Alta | Alta | Média | Baixa | Baixa | Fora do Escopo |
| Notificação | Alta | Média | Média | Baixa | Baixa | Fora do Escopo |
| Eventos | Média | Média | Baixa | Baixa | Baixa | Fora do Escopo |
| Participantes / inscrições | Alta | Alta | Baixa | Média | Média | Fora do Escopo |
| Envio de e-mail (Nodemailer/MailPit) | Média | Baixa | Alta | Baixa | Baixa | Fora do Escopo |
| Camada de dados (models + MySQL) | Alta | Alta | Média | Média | Baixa | Fora do Escopo |

### Justificativa

#### Autenticação
É alta em Regressão, Segurança e Recuperação por ser a entrada do sistema e proteger dados e contas. É média em Performance e Estresse por ter menor volume e acesso direto.

#### Notificação
É alta em Regressão, Segurança e Performance para garantir entrega rápida e segura. Recuperação é média para tratar falhas pontuais; Estresse e Paralelo têm baixa ou nenhuma relevância.

#### Eventos
É alta apenas em Regressão para evitar quebras na visualização e listagem. É baixa em Segurança, Recuperação e Estresse, e média em Performance por focar em consultas públicas.

#### Participantes / Inscrições
É alta em Regressão para preservar cadastros e inscrições. A criticidade nas demais áreas é média por envolver dados e regras de negócio de impacto moderado.

#### Envio de e-mail (Nodemailer/MailPit)
É alta em Segurança e Performance para processar mensagens sensíveis e filas sem gargalos. Regressão é média, e Recuperação/Estresse são baixos.

#### Camada de dados (models + MySQL)
É alta em Regressão e Segurança devido ao risco de falhas estruturais ou vazamentos. É média em Recuperação e Performance, e baixa em Estresse.

#### Paralelo
É definido como fora do escopo em todas as camadas, pois não é o foco desta fase de testes.

---

## Parte 2 — Escopo: o que fica dentro e o que fica fora

### 2.1 Técnicas que ficam dentro do escopo desta UC

| Técnica | Ferramenta prevista | Em que nível será aplicada |
|---|---|---|
| Regressão | Supertest | Alta |
| Segurança | Matriz de Rastreabilidade de Requisitos | Médio |
| Performance | EAP | Alta |

### 2.2 Técnicas que ficam fora do escopo

| Técnica descartada | Motivo | Tipo de motivo |
|---|---|---|
| Recuperação | Ocorre somente se houver erro no sistema | Falta de requisito |
| Paralelo | Ocorre quando há uma versão antiga do projeto | Falta de ferramenta |
| Estresse | Ocorre somente quando o sistema atinge uma carga acima do esperado | Falta de tempo |

---

## Parte 3 — Verificações de segurança

| # | O que verificar | Nível | Resultado esperado |
|---|---|---|---|
| 1 | Criptografia / Hashing de senhas de usuários no banco de dados ao realizar cadastro ou alteração. | Banco de Dados / Persistência | A coluna senha (ou password) na tabela usuários deve armazenar a senha em formato hash (ex.: Bcrypt/Argon2). A senha em texto puro jamais deve ser persistida ou gravada nos logs do MySQL. |
| 2 | Tentativa de acesso a rotas protegidas (ex.: /notificacoes ou /participantes) utilizando token JWT inválido, expirado ou ausente. | Integração / API (HTTP) | A requisição deve ser bloqueada imediatamente com o código HTTP 401 Unauthorized e payload de erro explicativo, sem expor dados do sistema. |
| 3 | Tentativa de um usuário autenticado ler/marcar como lida a notificação pertencente a outro usuário (IDOR - Insecure Direct Object Reference). | Regra de Negócio / Integração | A API deve retornar HTTP 403 Forbidden (ou 404 Not Found), impedindo o acesso ou alteração de dados de terceiros. |

---

## Parte 4 — Regressão no calendário (se sobrar tempo)

### 4.1 Em que momentos o grupo vai rodar a suíte completa?
R: Depois de cada mudança no projeto, na hora de testar e antes de cada commit.

### 4.2 Quem no grupo é responsável por verificar que a suíte está passando antes de uma entrega?
R: Miguel Munhoz, responsável por fazer a checagem final com olhar treinado para garantir a qualidade.

### 4.3 O que o grupo faz se, na véspera de uma entrega, a suíte acusar falha em um teste que antes passava?
R: O grupo deve parar as alterações no código, identificar o commit que causou o erro e revertê-lo (se for bug) ou atualizar o teste. O deploy só ocorre com a suíte 100% aprovada.
