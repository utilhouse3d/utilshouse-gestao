# Ativação da versão compartilhada

A base Supabase já existe; as tabelas protegidas por RLS estão instaladas. A versão web fica em `web/`.

1. No Supabase Dashboard, abra Authentication > Users e crie três usuários com os identificadores exatos abaixo e a senha inicial combinada:
   - Felipe — `felipe@users.utilshouse.invalid`
   - Vinicius — `vinicius@users.utilshouse.invalid`
   - Bruxao — `bruxao@users.utilshouse.invalid`
   Marque os e-mails como confirmados. São aliases internos reservados, não caixas postais. A senha de cada conta é digitada só no painel do Supabase; não a ponha no GitHub. Desative novos cadastros públicos.
2. Copie o UUID de cada usuário. No SQL Editor, execute os três inserts comentados no final de `schema.sql`, com UUID e nome correspondentes. A tabela de autorização está vazia até isso ser feito; sem registro ninguém acessa os dados.
3. No GitHub, abra Settings > Pages e selecione branch `main`, pasta `/web`. Confirme que o plano permite Pages para o repositório privado. Não torne o repositório público. A página terá um endereço da internet; o banco só autoriza os três UUIDs adicionados.
4. Abra o endereço Pages e confirme que o login e o bloqueio anônimo funcionam.

A URL do projeto e a Publishable key já estão em `web/config.js`. A chave publicada é somente identificadora; nunca coloque Secret key ou service_role nesse arquivo. O acesso ao banco é limitado pela política RLS ao allow-list de UUIDs.

Os três usuários autorizados compartilham os dados e podem alterá-los. Recarregar exige login outra vez. Use Atualizar dados para ver mudanças dos colegas. O salvamento verifica a revisão para evitar sobrescrever silenciosamente edições simultâneas; em conflito, exporte backup, atualize e reaplique manualmente.

Os dados antigos continuam no navegador local e não foram enviados à base. O financeiro pode ser restaurado no HTML antigo; pedidos podem ser exportados em CSV, mas ainda não há importação de pedidos para a nuvem. Guarde os backups.

Documentação: https://supabase.com/docs/guides/database/postgres/row-level-security e https://supabase.com/docs/guides/getting-started/api-keys.
