# Ativação da versão compartilhada

A base Supabase já existe; as tabelas protegidas por RLS estão instaladas. A versão web fica em `web/`.

1. Em Supabase > Authentication > Users, crie Felipe, Vinicius e Bruxao com os identificadores internos e senha inicial descritos abaixo. Marque os e-mails como confirmados. São aliases internos reservados, não caixas postais. Desative novos cadastros públicos.
2. Copie o UUID de cada conta e execute os três inserts comentados no final de `schema.sql` no SQL Editor. A tabela de autorização só libera esses usuários depois dos inserts.
3. Em GitHub > Settings > Pages, escolha **GitHub Actions** em Build and deployment > Source e salve.
4. Abra Actions e confira o fluxo **Deploy UtilsHouse to GitHub Pages**. Se a execução inicial falhar por Pages ainda estar desligado, execute novamente depois de salvar a configuração. O endereço aparece ao concluir o deploy.
5. Confirme o login e o bloqueio de acesso anônimo.

Contas Supabase para criar:
- Felipe: `felipe@users.utilshouse.invalid`
- Vinicius: `vinicius@users.utilshouse.invalid`
- Bruxao: `bruxao@users.utilshouse.invalid`

Use a senha inicial combinada para cada conta e confirme cada endereço no painel. A URL Supabase e a chave Publishable já estão configuradas em `web/config.js`. A Publishable key é pública; nunca publique uma Secret key ou service_role. As políticas RLS só autorizam os UUIDs da tabela `gestao_members`.

O repositório pode continuar privado, mas o endereço GitHub Pages é acessível pela internet. A página exige login e o banco só libera os três UUIDs. Pages em repositório privado depende do plano GitHub; se o seletor Actions não estiver disponível, esse plano não habilita a publicação privada.

Os usuários autorizados compartilham os dados. Recarregar exige login outra vez. Use Atualizar dados para ver mudanças dos colegas. O salvamento verifica a revisão para evitar sobrescrever edições simultâneas; em conflito, exporte backup, atualize e reaplique manualmente.

Os dados antigos continuam no navegador e não migraram para a base. O financeiro pode ser restaurado no HTML antigo. Pedidos podem ser exportados em CSV; ainda não há importador de pedidos para a nuvem. Guarde os backups.

Documentação: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site e https://supabase.com/docs/guides/database/postgres/row-level-security.
