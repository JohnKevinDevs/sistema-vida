# Templates curtos de prompt

Use estes modelos junto com `AGENTS.md` e `docs/current-state.md`.

## Feature pequena

```text
Execute a Fase X.Y - NOME.

Objetivo:
- DESCREVA O RESULTADO.

Escopo:
- ITEM 1
- ITEM 2

Nao fazer:
- ITEM FORA DO ESCOPO

Valide:
- npm.cmd run lint
- npm.cmd run build
- npm.cmd run dev, se houver UI

Commit:
git commit -m "MENSAGEM"
git push
```

## Auditoria

```text
Execute a Fase X.Y - Auditoria de NOME.

Audite:
- fluxo 1
- fluxo 2
- API, UI e banco relacionados

Corrija apenas bugs pequenos e reais.
Nao crie novas features.

Valide e faca commit/push se houver alteracao.
```

## Correcao de bug

```text
Corrija o bug:
- DESCREVA O BUG
- COMO REPRODUZIR
- COMPORTAMENTO ESPERADO

Preserve o escopo.
Nao refatore alem do necessario.
Rode lint/build e teste o fluxo afetado.
Commit: "Fix ..."
```

## UI polish

```text
Execute polish visual em:
- AREA OU COMPONENTE

Objetivo:
- melhorar hierarquia, espacamento, contraste e microcopy

Nao alterar backend, schema, endpoints ou comportamento funcional.
Preserve todas as funcionalidades existentes.
Valide no navegador.
```

## Migracao SQLite

```text
Execute migracao SQLite para:
- DESCREVER ALTERACAO

Regras:
- migracao idempotente
- preservar dados existentes
- nao commitar .db
- validar banco local
- documentar no README ou docs relevantes

Valide lint/build e fluxo afetado.
```

## Documentacao

```text
Atualize a documentacao de:
- TEMA

Nao alterar codigo, UI, API ou banco.
Confirmar que apenas arquivos .md foram alterados.
Commit: "Update documentation"
```
