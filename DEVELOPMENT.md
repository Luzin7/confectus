# 🚀 Development Workflow & CI/CD Guide

Este documento descreve o workflow de desenvolvimento automatizado implementado no projeto Confectus.

## 📋 Resumo das Implementações

### ✅ Feito

- **Refatoração completa da arquitetura** seguindo Clean Architecture
- **Suite de testes abrangente** com cobertura de 80%+
- **Pipeline CI/CD automatizada** com GitHub Actions
- **Integração com Changesets** para versionamento automático
- **Validação automática de PRs** com gates de qualidade
- **Scanning de segurança** com Trivy
- **Conventional Commits** para padronização

### 🏗️ Arquitetura Clean

```
src/
├── application/         # Casos de uso e DTOs
│   ├── dtos/           # Definições de tipos
│   └── useCases/       # Lógica de negócio
├── core/               # Contratos e regras de negócio
│   ├── contracts/      # Interfaces e abstrações
│   └── errors/         # Definições de erros
├── infrastructure/     # Implementações externas
│   ├── cli/           # Interface CLI
│   ├── filesystem/    # Operações de arquivo
│   └── services/      # Serviços de infraestrutura
├── configs/           # Configurações
└── templates/         # Templates de arquivos
```

## 🔄 Workflow de Desenvolvimento

### 1. Criação de Feature Branch

```bash
git checkout -b feature/nome-da-funcionalidade
```

### 2. Desenvolvimento com TDD

```bash
# Executar testes em modo watch
npm test

# Verificar cobertura
npm run test:coverage

# Lint e format
npm run lint:fix
```

### 3. Commits Seguindo Conventional Commits

```bash
# Exemplos de commits válidos:
git commit -m "feat: add new template generator"
git commit -m "fix: resolve dependency injection issue"
git commit -m "refactor: improve error handling"
git commit -m "test: add unit tests for new service"
git commit -m "docs: update API documentation"
git commit -m "ci: update workflow configuration"
```

### 4. Criação de Changeset

```bash
# Para mudanças que afetam a API pública
npm run changeset

# Selecionar tipo de mudança:
# - patch: bug fixes, pequenas melhorias
# - minor: novas funcionalidades, mudanças não-breaking
# - major: breaking changes
```

### 5. Push e Pull Request

```bash
git push -u origin feature/nome-da-funcionalidade
```

## 🤖 Pipeline CI/CD

### Validação Automática (PRs)

- ✅ **Lint**: Verificação de código com Biome
- ✅ **Build**: Compilação TypeScript
- ✅ **Tests**: Execução de todos os testes
- ✅ **Coverage**: Verificação de cobertura mínima
- ✅ **Security**: Scan de vulnerabilidades
- ✅ **Changesets**: Validação de changeset (PRs para main)

### Release Automático (Main Branch)

- ✅ **Quality Gates**: Mesmas validações dos PRs
- ✅ **Version Bump**: Aplicação automática de changesets
- ✅ **Changelog**: Atualização automática
- ✅ **NPM Publish**: Publicação automática no registry
- ✅ **Git Tags**: Criação automática de tags

## 📊 Métricas de Qualidade

### Cobertura de Testes

- **Mínimo exigido**: 80% em todas as métricas
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Linting

- **Biome**: Formatação e linting automatizado
- **TypeScript**: Verificação estrita de tipos
- **Conventional Commits**: Padronização de mensagens

## 🛡️ Segurança

### Scanning Automático

- **Trivy**: Scan de vulnerabilidades em dependências
- **Dependabot**: Atualizações automáticas de segurança
- **SARIF Upload**: Integração com GitHub Security

### Secrets Management

Variáveis necessárias no GitHub:

- `NPM_TOKEN`: Token para publicação no NPM
- `CODECOV_TOKEN`: Token para reportes de cobertura (opcional)

## 🚀 Workflow de Release

### Automatizado

1. **Merge para main** → Trigger automático
2. **Quality Gates** → Validação completa
3. **Changeset Application** → Atualização de versão
4. **Build & Test** → Compilação final
5. **NPM Publish** → Publicação automática
6. **Git Tag** → Criação de tag da versão

### Manual (se necessário)

```bash
# Aplicar changesets manualmente
npm run version

# Build e publicação manual
npm run build
npm run release
```

## 📝 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Executar em modo desenvolvimento
npm run build           # Build de produção
npm test                # Testes em modo single-run
npm run test:coverage   # Testes com relatório de cobertura

# Qualidade
npm run lint            # Verificar código
npm run lint:fix        # Corrigir problemas automaticamente
npm run type-check      # Verificação de tipos

# Changesets
npm run changeset       # Criar novo changeset
npm run version         # Aplicar changesets
npm run release         # Build e publicação
```

## 🎯 Boas Práticas

### Git

- Use **conventional commits** sempre
- Mantenha **commits atômicos** e focados
- Escreva **mensagens descritivas**
- Use **changesets** para mudanças na API

### Código

- Siga a **Clean Architecture**
- Escreva **testes** para todas as funcionalidades
- Mantenha **alta cobertura** de testes
- Use **dependency injection** consistentemente

### Documentação

- Mantenha **README.md** atualizado
- Documente **breaking changes** em changesets
- Use **JSDoc** para funções complexas
- Atualize **CHANGELOG.md** via changesets

## 🔧 Troubleshooting

### Pipeline Falhando

1. Verificar logs detalhados na aba Actions
2. Executar comandos localmente para reproduzir
3. Verificar se todos os testes passam: `npm test`
4. Verificar linting: `npm run lint`

### Changesets

- Se esqueceu de criar: `npm run changeset`
- Para mudanças breaking: selecionar "major"
- Para novas features: selecionar "minor"
- Para bug fixes: selecionar "patch"

### Dependências

- Use `npm install` ao invés de outros gerenciadores
- Mantenha `package-lock.json` sempre commitado
- Para atualizações de segurança, aceite PRs do Dependabot

---

**Este workflow garante qualidade, consistência e automatização completa do processo de desenvolvimento e release.** 🎉
