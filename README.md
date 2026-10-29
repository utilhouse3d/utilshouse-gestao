# UtilsHouse — plataforma com login

Contas: Felipe, Vinicius e Bruxao (maiúsculas/minúsculas indiferentes). A senha inicial comum é configurada fora do código. Nunca envie `.env` para o GitHub.

## Uso local

1. Instale Node.js 22 ou superior.
2. Copie `.env.example` para `.env` e preencha `INITIAL_PASSWORD` com a senha combinada. Não use aspas desnecessárias nem publique esse arquivo.
3. Execute `npm start` nesta pasta.
4. Abra http://localhost:3000. Para testes automatizados: `npm test`.

Não abra `private/platform.html` diretamente para testar o login: esse arquivo é o modelo interno do servidor.

## GitHub e hospedagem

Envie package.json, server.mjs, README.md, test.mjs, .gitignore, .env.example e a pasta private para o repositório privado. Remova o antigo index.html da raiz para evitar confusão com a versão sem login. Não habilite GitHub Pages nem hospede a pasta como arquivos estáticos.

Use hospedagem Node.js com HTTPS. Comando inicial: `npm start`. Configure os segredos/variáveis no painel da hospedagem:

- INITIAL_PASSWORD: senha inicial combinada, fora do GitHub.
- APP_ORIGIN: URL HTTPS exata da hospedagem, sem barra final.
- NODE_ENV: production.
- PORT: valor fornecido pela hospedagem, ou 3000.

Execute apenas uma instância. Sessões e bloqueios de tentativas ficam na memória; reiniciar encerra sessões. O cookie de produção exige HTTPS. Nenhuma rota pública serve o HTML interno, código, configuração ou arquivos do projeto. O prazo de sessão é de 8 horas. Senhas são derivadas com salt por usuário e scrypt; comparação em tempo constante. Não há senha embutida no navegador. Consulte https://nodejs.org/api/crypto.html.

## Dados e limites desta versão

Calculadora, logo, pedidos, estoque e financeiro foram preservados. Os registros continuam no armazenamento local do navegador, compartilhados pelos três usuários naquele navegador. O login controla acesso ao site; não transforma os registros em dados separados por pessoa, nem criptografa dados no dispositivo. Celular e computador não sincronizam. Use um dispositivo de confiança e exporte backups. Ao mudar do arquivo local para o site, restaure o backup financeiro no novo endereço; pedidos antigos podem ser consultados no HTML anterior e exportados em CSV. Esta versão ainda não importa pedidos CSV.

O servidor não armazena lançamentos financeiros. Banco de dados compartilhado, recuperação de senha, alteração individual de senha e múltiplas instâncias são etapas futuras. Alterar INITIAL_PASSWORD e reiniciar redefine a senha comum e invalida todas as sessões.
