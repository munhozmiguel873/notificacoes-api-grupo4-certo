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

## 2. Tecnologias Utilizadas
______________________________________________________________________________________________________________
| Tecnologia | Versão |                                   Justificativa                                       |
|------------|--------| --------------------------------------------------------------------------------------|
| Node.js    | v18+   | Escolhemos o Node.js por ser uma plataforma de desenvolvimento leve e eficiente e     |   
|            |        | ideal para construir APIs.                                                            |
|------------|--------|---------------------------------------------------------------------------------------|
| Express.js | 4.x    | Optamos pelo Express.js por ser um framework minimalista e flexível para Node.js, que |   
|            |        | facilita a criação de APIs  RESTful.                                                  | 
| -----------|--------|---------------------------------------------------------------------------------------|
| MySQL      | 8.0    | [por que — sinergia com BD]                                                           |
| -----------|--------|---------------------------------------------------------------------------------------|
| Sequelize  | 6.x    | [por que]                                                                             |
| -----------|--------|---------------------------------------------------------------------------------------|
| ...        |        |                                                                                       |
| -----------|--------|---------------------------------------------------------------------------------------|


| Node.js    | v18+   | [por que escolheram]
escolhemos o Node.js por ser uma plataforma de desenvolvimento leve e eficiente, ideal para construir APIs. Ele possui uma vasta comunidade e uma grande quantidade de bibliotecas disponíveis, o que facilita a implementação de funcionalidades adicionais no futuro. Além disso, o Node.js é conhecido por seu desempenho em aplicações I/O intensivas, o que é benéfico para uma API que pode lidar com múltiplas requisições simultâneas.
| Express.js | 4.x    | [por que]
Optamos pelo Express.js por ser um framework minimalista e flexível para Node.js, que facilita a criação de APIs RESTful. Ele oferece uma estrutura simples para definir rotas, middlewares e lidar com requisições e respostas, o que acelera o desenvolvimento. O Express também é amplamente utilizado na indústria, tornando-o uma escolha sólida para este projeto.
| MySQL      | 8.0    | [por que — sinergia com BD]
Escolhemos o MySQL como nosso sistema de gerenciamento de banco de dados devido à sua robustez, escalabilidade e ampla adoção. O MySQL é uma escolha popular para aplicações web e oferece suporte a transações, o que é importante para garantir a integridade dos dados em operações críticas. Além disso, o MySQL é compatível com o Sequelize, nosso ORM escolhido, facilitando a integração entre a aplicação e o banco de dados.
| Sequelize  | 6.x    | [por que]
Optamos pelo Sequelize como nosso ORM (Object-Relational Mapping) para facilitar a interação com o banco de dados MySQL. O Sequelize oferece uma abstração de alto nível para manipulação de dados, permitindo que trabalhemos com objetos JavaScript em vez de escrever consultas SQL diretamente. Ele suporta recursos avançados como associações, validações e migrações, o que torna o desenvolvimento mais eficiente e organizado. Além disso, o Sequelize é bem documentado e amplamente utilizado na comunidade Node.js, o que nos proporcionou uma curva de aprendizado suave.








---

## 3. Arquitetura do Sistema
### 3.1 Diagrama de Classes
[Referência ao diagrama UML em docs/]
### 3.2 Arquitetura em Camadas
[Descreva brevemente: Routes → Controllers → Services → Models → MySQL]
### 3.3 Banco de Dados

[Quantas tabelas, relacionamentos principais]

---

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
| Notificações por e-mail           |   [status]  |     4     |
| Deploy                            |   [status]  |     5     |
| Documentação Swagger              |   [status]  |     5     |

---

## 5. Processo de Desenvolvimento
### 5.1 Metodologia
[Ágil com sprints de 2 semanas, Kanban no GitHub Projects]
### 5.2 Divisão de Trabalho
[Quem fez o quê — referência à matriz RACI]
### 5.3 Controle de Versão
[Quantos commits, como organizaram branches]

---

## 6. Desafios e Soluções
| Desafio | Como resolvemos |
| ------------------------------- | ------------------------------------------- |

| [ex: conflitos de merge] | [ex: combinamos de sempre fazer pull antes] |
| [ex: Sequelize logging confuso] | [ex: desativamos em produção] |

---

## 7. Lições Aprendidas
[O que cada membro aprendeu de mais importante durante o projeto]

---

## 8. Próximos Passos (se o projeto continuasse)
[O que fariam se tivessem mais tempo — autenticação, front-end, notificações push, etc.]

---

## 9. Referências
- [Documentação do Express.js](https://expressjs.com/)
- [Documentação do Sequelize](https://sequelize.org/)
- [Documentação do Nodemailer](https://nodemailer.com/)