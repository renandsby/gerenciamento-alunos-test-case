from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import IntegrityError
from alunos.models import Turma, Aluno
from faker import Faker
import random
from datetime import date, timedelta


class Command(BaseCommand):
    help = 'Popula o banco de dados com dados de exemplo'

    def handle(self, *args, **options):
        fake = Faker('pt_BR')
        
        # Criar superusuário se não existir
        self.stdout.write('Criando superusuário...')
        try:
            if not User.objects.filter(username='admin').exists():
                User.objects.create_superuser(
                    username='admin',
                    email='admin@example.com',
                    password='admin123'
                )
                self.stdout.write(self.style.SUCCESS('✓ Superusuário criado (admin/admin123)'))
            else:
                self.stdout.write(self.style.WARNING('✓ Superusuário já existe'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Erro ao criar superusuário: {e}'))
        
        # Criar usuário comum para testes
        try:
            if not User.objects.filter(username='usuario').exists():
                user = User.objects.create_user(
                    username='usuario',
                    email='usuario@example.com',
                    password='usuario123'
                )
                # Criar token para o usuário
                from rest_framework.authtoken.models import Token
                Token.objects.get_or_create(user=user)
                self.stdout.write(self.style.SUCCESS('✓ Usuário comum criado (usuario/usuario123)'))
            else:
                self.stdout.write(self.style.WARNING('✓ Usuário comum já existe'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Erro ao criar usuário comum: {e}'))
        
        # Criar tokens para admin se não existir
        try:
            from rest_framework.authtoken.models import Token
            admin_user = User.objects.get(username='admin')
            Token.objects.get_or_create(user=admin_user)
        except Exception:
            pass
        
        # Limpar dados existentes (opcional - comentar se não quiser limpar)
        self.stdout.write('Verificando dados existentes...')
        if Turma.objects.exists():
            self.stdout.write(self.style.WARNING('✓ Dados já existem, pulando seed'))
            return
        
        # Criar turmas
        self.stdout.write('Criando turmas...')
        turmas = []
        anos = [2026,]
        turnos = ['manha', 'tarde', 'noite']
        series = ['1º Ano A', '1º Ano B', '2º Ano A', '2º Ano B', '3º Ano A', '3º Ano B']
        
        for serie in series:
            for ano in anos:
                turno = random.choice(turnos)
                turma = Turma.objects.create(
                    nome=serie,
                    ano_letivo=ano,
                    turno=turno
                )
                turmas.append(turma)
                self.stdout.write(f'  ✓ {turma}')
        
        self.stdout.write(self.style.SUCCESS(f'✓ {len(turmas)} turmas criadas'))
        
        # Criar alunos
        self.stdout.write('Criando alunos...')
        alunos_criados = 0
        
        for i in range(50):
            turma = random.choice(turmas)
            
            # Gerar data de nascimento entre 15 e 25 anos atrás
            hoje = date.today()
            anos_atras = random.randint(15, 25)
            dias_variacao = random.randint(0, 365)
            data_nascimento = hoje - timedelta(days=anos_atras*365 + dias_variacao)
            
            # Gerar matrícula única
            matricula = f"{random.randint(2020, 2025)}{random.randint(1000, 9999)}"
            
            # Tentar criar aluno
            try:
                aluno = Aluno.objects.create(
                    nome=fake.name(),
                    email=fake.email(),
                    matricula=matricula,
                    data_nascimento=data_nascimento,
                    turma=turma
                )
                alunos_criados += 1
                if alunos_criados <= 5:  # Mostrar apenas os primeiros 5
                    self.stdout.write(f'  ✓ {aluno.nome} - {aluno.matricula}')
            except IntegrityError:
                # Matrícula duplicada, tentar novamente
                continue
        
        self.stdout.write(self.style.SUCCESS(f'✓ {alunos_criados} alunos criados'))
        self.stdout.write(self.style.SUCCESS('\n=== Seed concluído com sucesso! ==='))
        self.stdout.write('Login: admin / admin123')
        self.stdout.write('Ou: usuario / usuario123')

