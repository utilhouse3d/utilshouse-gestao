# Ativação da versão compartilhada

1. Crie uma conta e projeto em https://supabase.com/dashboard. Mantenha a senha do banco em seu gerenciador de senhas.
2. Execute `schema.sql` no SQL Editor do projeto novo.
3. Desative novos cadastros públicos. Crie os três usuários via Authentication com e-mail real de cada pessoa e a senha inicial escolhida. Não invente e-mails.
4. Registre UUID e nome dos três membros na tabela `gestao_members`, usando os exemplos comentados ao fim do SQL. Sem isso, ninguém lê os dados.
5. Preencha `web/config.js` com URL do projeto, chave Publishable e e-mails de cada pessoa. Esses dados são públicos. Nunca use Secret key ou service_role.
6. Teste acesso anônimo negado, usuário fora da lista negado, leitura e gravação para os membros e conflitos entre duas sessões. Teste local não comprova as regras remotas.
7. Publique apenas a pasta `web/` pelo GitHub Pages. Repositórios privados podem exigir plano compatível; confira Settings > Pages. Não torne o repositório público sem autorização.

Todos os três usuários autorizados compartilham os registros e podem alterá-los. A sessão fica na memória da aba e exige login novamente após recarregar. Atualize para ver mudanças dos colegas. A gravação verifica revisão e não sobrescreve silenciosamente edições concorrentes; em conflito, exporte backup, atualize e reaplique manualmente. Dados do navegador antigo não migram automaticamente: financeiro pode ser importado no HTML anterior; pedidos exportam para CSV, mas ainda não há importador. Guarde os backups.

Esta preparação não criou banco, usuário remoto ou publicação. Documentação: https://supabase.com/docs/guides/database/postgres/row-level-security e https://supabase.com/docs/guides/getting-started/api-keys.

