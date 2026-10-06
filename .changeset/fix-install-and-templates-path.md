---
"confectus": patch
---

fix(cli): instalação determinística e templates resolvidos pelo módulo

- Pina as dependências do projeto gerado e isola o alvo de dev (`mock/`)
- Corrige a resolução de templates em produção (relativa ao módulo, multiplataforma)
- Migra o ESLint gerado para v9 flat-native e o Biome para o schema v2
- Remove código morto (templates, exports, aliases e deps sem uso)
