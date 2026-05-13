# Workflow padrao do Codex

## Antes de comecar

1. Ler `AGENTS.md`.
2. Ler `docs/current-state.md`.
3. Executar:

```powershell
git status --short --branch
```

4. Se houver alteracoes inesperadas, parar e informar.
5. Confirmar o escopo da fase atual.

## Durante a implementacao

- Fazer mudancas pequenas.
- Preservar funcionalidades existentes.
- Nao criar features fora do escopo.
- Usar os padroes ja existentes no projeto.
- Evitar novas dependencias.
- Evitar refatoracoes grandes sem necessidade.
- Para edicoes manuais, usar patch.

## Validacao

Para codigo:

```powershell
npm.cmd run lint
npm.cmd run build
```

Para UI ou fluxo visual:

```powershell
npm.cmd run dev
```

Validar no navegador quando aplicavel.

Para API, usar PowerShell com `Invoke-RestMethod` quando aplicavel.

Para banco, verificar de forma simples que:

- dados antigos foram preservados;
- tabelas/colunas esperadas existem;
- nenhum `.db` sera commitado.

## Antes do commit

Executar:

```powershell
git status --short
git diff --stat
```

Confirmar que nao entram no commit:

- `.env.local`
- `data/sistema-jk.db`
- `data/*.db-*`
- `node_modules`
- `.next`
- logs locais
- backups

## Commit e push

Se validacoes passarem:

```powershell
git add .
git commit -m "Mensagem descritiva"
git push
```

Para etapas de documentacao, adicionar explicitamente apenas os arquivos `.md` criados ou alterados.

## Resposta final

Responder com:

- resumo;
- arquivos alterados;
- validacoes;
- problemas encontrados;
- confirmacao de Git;
- commit;
- push;
- proximo passo recomendado.

Se o usuario fornecer formato proprio, seguir o formato dele.
