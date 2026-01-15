# Sistema de Gerenciamento de Alunos

Sistema de gerenciamento de alunos e turmas desenvolvido com Django REST Framework e React, containerizado com Docker.

## Pré-requisitos

- Docker
- Docker Compose

## Configuração

### Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configuração. O Docker Compose lê automaticamente variáveis de um arquivo `.env` na raiz do projeto.

Copie o arquivo de exemplo na raiz do projeto:
```bash
cp .env.example .env
```

**Nota:** Se o arquivo `.env` não existir, o sistema usará os valores padrão definidos no código e no `docker-compose.yml`.

## Execução

Para iniciar o projeto:

```bash
docker-compose up --build
```

O comando acima irá:
- Criar e iniciar os containers (PostgreSQL, Backend Django, Frontend React)
- Executar as migrações do banco de dados automaticamente

Após a inicialização, acesse:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Admin Django: http://localhost:8000/admin/

## Popular dados

Para popular o banco de dados com dados de exemplo e criar usuários padrão:

```bash
docker-compose exec backend python manage.py seed_data
```

## Credenciais padrão de exemplo

**Administrador:**
- Usuário: `admin`
- Senha: `admin123`

**Usuário comum:**
- Usuário: `usuario`
- Senha: `usuario123`


## Comandos úteis

Parar os containers:
```bash
docker-compose down
```

Parar e remover volumes (limpar banco de dados):
```bash
docker-compose down -v
```

Ver logs:
```bash
docker-compose logs -f
```

## Solução de problemas

```bash
# Opção 1: Reconstruir os containers do zero
docker-compose down --rmi all -v
docker-compose build --no-cache
docker-compose up -d

# Opção 2: Corrigir problemas com o entrypoint
chmod +x backend/entrypoint.sh
sed -i 's/\r$//' backend/entrypoint.sh
```

