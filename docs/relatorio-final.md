Atividade: Relatório Técnico Final
Este é o documento que consolida tudo que o grupo fez ao longo do semestre. Crie
docs/relatorio-final.md :

# Relatório Técnico — API de Notificações
**Grupo:** [4]
**Membros:** [Miguel Munhoz, Pedro Augusto, Pietro Dipiassa]
**Data:** [21/05/2026]

---

## 1. Introdução
### 1.1 Objetivo do Projeto
[Descreva em 2-3 parágrafos o que o projeto faz e por que ele é necessário]
O projeto é uma API de Notificações que gerencia eventos, participantes e inscrições. Ele permite o cadastro de eventos, a inscrição de participantes e a organização das informações necessárias para futuros envios de notificações por e-mail. A API é essencial para facilitar a comunicação entre organizadores de eventos e seus participantes, garantindo que todos estejam informados sobre atualizações, lembretes e outras comunicações importantes relacionadas aos eventos.

### 1.2 Escopo
[O que está incluído e o que ficou de fora]
O escopo do projeto inclui o desenvolvimento de uma API REST para gerenciar eventos, participantes e inscrições, utilizando Node.js e Express. A API suporta operações CRUD para eventos e participantes, bem como a criação de inscrições. O projeto não inclui a implementação de um front-end, integração com serviços de terceiros para envio de notificações por e-mail ou autenticação de usuários. O foco principal é a estruturação da API e a organização dos dados em memória, sem persistência em banco de dados.

---

| Tecnologia | Versão |  Justificativa                                                                                                         |
| ---------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| Node.js    | v18+   | Escolhemos o Node.js por ser uma plataforma de desenvolvimento leve e eficiente, ideal para construir APIs.                                                                                                                                                  |
| Express.js | 4.x    | Optamos pelo Express.js por ser um framework minimalista e flexível para Node.js, que facilita a criação de APIs RESTful.                                                                                                                                    |
| MySQL      | 8.0    | Escolhemos o MySQL como nosso sistema de gerenciamento de banco de dados devido à sua robustez, escalabilidade e ampla adoção no mercado.                                                                                                                    |
| Sequelize  | 6.x    | Escolhemos o Sequelize por ser um ORM (Object-Relational Mapping) que simplifica a interação com o banco de dados, permitindo manipular tabelas e registros por meio de objetos JavaScript, além de facilitar a manutenção e o desenvolvimento da aplicação. |

Você pode preencher essa seção assim:

### 3. Arquitetura do Sistema

#### 3.1 Diagrama de Classes

O diagrama de classes do sistema encontra-se na pasta **docs/** do projeto e representa as entidades principais, seus atributos, métodos e relacionamentos, servindo como base para a modelagem orientada a objetos da aplicação.

#### 3.2 Arquitetura em Camadas

O sistema foi desenvolvido seguindo o padrão de arquitetura em camadas, visando organização, manutenção e escalabilidade.

**Fluxo da aplicação:**

**Routes → Controllers → Services → Models → MySQL**

* **Routes:** definem os endpoints da API e recebem as requisições HTTP.
* **Controllers:** processam as requisições recebidas, validam os dados e encaminham as operações para a camada de serviços.
* **Services:** concentram as regras de negócio da aplicação.
* **Models:** representam as entidades do banco de dados e realizam a comunicação com o Sequelize ORM.
* **MySQL:** responsável pelo armazenamento persistente dos dados do sistema.

Essa separação de responsabilidades facilita a manutenção, os testes e a evolução do projeto.

#### 3.3 Banco de Dados

O banco de dados foi modelado utilizando o MySQL e é composto pelas tabelas necessárias para armazenar as informações do sistema.

**Principais tabelas:**

* Usuários
* Eventos
* Inscrições

**Relacionamentos:**

* Um usuário pode realizar várias inscrições.
* Um evento pode possuir várias inscrições.
* Cada inscrição pertence a um único usuário e a um único evento.

Dessa forma, o relacionamento entre **Usuários** e **Eventos** é do tipo **muitos para muitos (N:N)**, sendo intermediado pela tabela **Inscrições**.

## 4. Funcionalidades Implementadas
|           Funcionalidade          |    Status   | Bloco PBE |
| --------------------------------- | ----------- | --------- |
| CRUD de Eventos                   | ✅ Completo |  1 e 3   |
| CRUD de Participantes             | ✅ Completo |  1 e 3   |
| Inscrições                        | ✅ Completo |  1 e 3   |
| Middlewares e tratamento de erros | ✅ Completo |    2     |
| Validação de dados                | ✅ Completo |    2     |
| Persistência MySQL                | ✅ Completo |    3     |
| Exportação JSON/XML               | ✅ Completo |    3     |
| Upload de arquivos                | ✅ Completo |    3     |
| Notificações por e-mail           |   ✅ Completo  |     4     |
| Deploy                            |   ✅ Completo  |     5     |
| Documentação Swagger              |   ✅ Completo  |     5     |

---

## 5. Processo de Desenvolvimento

### 5.1 Metodologia

A equipe adotou uma metodologia ágil baseada em sprints de duas semanas, permitindo a entrega gradual das funcionalidades do sistema. Para o acompanhamento das tarefas foi utilizado o GitHub Projects no formato Kanban, organizando as atividades em colunas como "A Fazer", "Em Desenvolvimento" e "Concluído".

### 5.2 Divisão de Trabalho

As responsabilidades foram distribuídas entre os membros da equipe de acordo com suas habilidades e disponibilidade. As atribuições detalhadas encontram-se na matriz RACI do projeto, contemplando atividades como modelagem do banco de dados, desenvolvimento da API, testes, documentação e gerenciamento do repositório.

### 5.3 Controle de Versão

O controle de versão foi realizado utilizando Git e GitHub. Cada funcionalidade foi desenvolvida em branches específicas, sendo posteriormente integrada à branch principal após revisão e testes. A equipe manteve um histórico organizado de commits com mensagens descritivas, facilitando o rastreamento das alterações e a colaboração entre os membros.

---

## 6. Desafios e Soluções

| Desafio                               | Como resolvemos                                                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Conflitos de merge entre branches     | Definimos a prática de realizar pull antes de iniciar novas alterações e manter branches atualizadas.               |
| Configuração inicial do Sequelize     | Consultamos a documentação oficial e criamos modelos padronizados para facilitar a integração com o banco de dados. |
| Organização das tarefas da equipe     | Utilizamos GitHub Projects com metodologia Kanban para acompanhar o andamento das atividades.                       |
| Tratamento de erros da API            | Implementamos validações e respostas padronizadas para melhorar a identificação de problemas.                       |
| Integração entre API e banco de dados | Realizamos testes incrementais para validar cada operação CRUD antes da integração completa.                        |

---

## 7. Lições Aprendidas

Durante o desenvolvimento do projeto, os integrantes adquiriram conhecimentos importantes sobre desenvolvimento back-end, trabalho em equipe e boas práticas de engenharia de software. Entre os principais aprendizados destacam-se:

* Utilização do Node.js e Express para criação de APIs RESTful.
* Modelagem e manipulação de bancos de dados relacionais utilizando MySQL.
* Uso do Sequelize ORM para abstração das operações de banco de dados.
* Controle de versão com Git e GitHub.
* Aplicação de metodologias ágeis e organização de tarefas em Kanban.
* Importância da documentação e da comunicação entre os membros da equipe.

---

## 8. Próximos Passos

Caso o projeto tivesse continuidade, as seguintes melhorias poderiam ser implementadas:

* Sistema completo de autenticação e autorização utilizando JWT.
* Desenvolvimento de uma interface front-end para os usuários.
* Implementação de notificações por e-mail ou push.
* Criação de dashboards com relatórios e estatísticas.
* Implementação de testes automatizados.
* Deploy da aplicação em ambiente de produção.
* Integração com serviços externos por meio de APIs.
* Melhorias de segurança e monitoramento da aplicação.


---

## 9. Referências
- [Documentação do Express.js](https://expressjs.com/)
- [Documentação do Sequelize](https://sequelize.org/)
- [Documentação do Nodemailer](https://nodemailer.com/)