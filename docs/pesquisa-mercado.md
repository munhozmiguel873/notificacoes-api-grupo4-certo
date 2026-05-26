# Pesquisa de Mercado — Serviços de Notificação

## Serviços de E-mail Transacional
|   Serviço  |      Plano Gratuito      | Preço Inicial |      Diferenciais      |
| ---------- | ------------------------ | ------------- | ---------------------- |
| SendGrid   | 100 emails/dia           | US$ 15/mês    | API robusta, templates |
| Mailgun    | 5.000/mês (3 meses)      | US$ 35/mês    | Foco em devs           |
| Amazon SES | 62.000/mês (se usar EC2) | US$ 0.10/1000 | Escala, preço          |
| Mailtrap   | 500/mês (teste)          | US$ 15/mês    | Sandbox para testes    |

## Como o nosso projeto se compara?

* Nosso projeto implementa uma API back-end para gerenciamento de eventos, participantes e inscrições.
* A solução atual utiliza MySQL e persistência própria, enquanto serviços de mercado oferecem envio real de e-mails e templates prontos.
* Recursos como notificações em massa, monitoramento de entregas e integração com provedores externos são diferenciais das plataformas de mercado.

---

## O que poderíamos adotar no futuro?

* Integração com SendGrid ou Mailgun para envio de e-mails reais
* Templates dinâmicos de e-mail
* Monitoramento de entregas e métricas de abertura
* Ambiente sandbox para testes com Mailtrap
* Sistema de envio de notificações em massa
* Suporte a múltiplos canais de notificação (SMS, push, etc.)
