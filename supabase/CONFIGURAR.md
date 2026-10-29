# Ativação da versão compartilhada

A base de dados Supabase já foi criada e as tabelas com proteção RLS já estão instaladas. A versão web está em `web/`; ela ainda aguarda os e-mails dos três usuários e a configuração de publicação.

1. No Supabase Dashboard, abra Authentication > Users e crie Felipe, Vinicius e Bruxao com o e-mail real de cada pessoa e a senha inicial combinada. Não envie senhas pessoais aqui.
2. Copie o UUID de cada usuário. No SQL Editor, execute os três comandos comentados no fim de `schema.sql`, substituindo UUID e nome. A tabela de autorização está vazia até esse passo; ninguém consegue ler os dados antes de ser incluído.
3. Em `web/config.js`, preencha o e-mail de cada usuário na propriedade correspondente. A URL e Publishable key já estão configuradas. A chave pública não permite acesso sem passar pelas políticas RLS; nunca adicione uma Secret key ou service_role ao HTML.
4. No GitHub, abra Settings > Pages e publique a branch `main`, pasta `/web`. Confirme que seu plano permite GitHub Pages em repositório privado. Não mude o repositório para público. O site publicado terá um endereço acessível pela internet; a tela exige login e o banco só autoriza os três UUIDs adicionados.
5. Depois do primeiro commit de `web/config.js`, acesse o endereço Pages e confira o acesso autorizado para cada conta e o bloqueio anônimo.

Os três usuários autorizados compartilham os mesmos dados e podem alterar registros. Recarregar exige login novamente. Use Atualizar dados para ver mudanças dos colegas. Salvamentos verificam a revisão do registro para evitar sobrescrever edições simultâneas. Ao surgir conflito, exporte o backup, atualize e reaplique as mudanças manualmente.

Os dados antigos continuam no navegador local e não foram enviados à base. O financeiro pode ser restaurado pelo recurso existente; pedidos podem ser exportados em CSV, mas a importação para a nuvem precisa de uma etapa adicional. Guarde os backups.

Documentação: https://supabase.com/docs/guides/database/postgres/row-level-security e https://supabase.com/docs/guides/getting-started/api-keys.
