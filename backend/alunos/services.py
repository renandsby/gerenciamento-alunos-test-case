from django.db import transaction
from .models import Turma, Aluno


class TurmaService:
    @staticmethod
    def criar_turma(nome, ano_letivo, turno):
        """Cria uma nova turma"""
        return Turma.objects.create(
            nome=nome,
            ano_letivo=ano_letivo,
            turno=turno
        )
    
    @staticmethod
    def atualizar_turma(turma_id, **kwargs):
        """Atualiza uma turma existente"""
        turma = Turma.objects.get(id=turma_id)
        for key, value in kwargs.items():
            setattr(turma, key, value)
        turma.save()
        return turma
    
    @staticmethod
    def deletar_turma(turma_id):
        """Deleta uma turma (e seus alunos em cascata)"""
        turma = Turma.objects.get(id=turma_id)
        turma.delete()
    
    @staticmethod
    def listar_turmas():
        """Lista todas as turmas"""
        return Turma.objects.all()
    
    @staticmethod
    def obter_turma(turma_id):
        """Obtém uma turma específica"""
        return Turma.objects.get(id=turma_id)


class AlunoService:
    @staticmethod
    def criar_aluno(nome, email, matricula, data_nascimento, turma_id):
        """Cria um novo aluno"""
        turma = Turma.objects.get(id=turma_id)
        
        if Aluno.objects.filter(matricula=matricula).exists():
            raise ValueError(f"Matrícula {matricula} já existe")
        
        return Aluno.objects.create(
            nome=nome,
            email=email,
            matricula=matricula,
            data_nascimento=data_nascimento,
            turma=turma
        )
    
    @staticmethod
    def atualizar_aluno(aluno_id, **kwargs):
        """Atualiza um aluno existente"""
        aluno = Aluno.objects.get(id=aluno_id)
        
        # Valida matrícula única se for atualizada
        if 'matricula' in kwargs and kwargs['matricula'] != aluno.matricula:
            if Aluno.objects.filter(matricula=kwargs['matricula']).exists():
                raise ValueError(f"Matrícula {kwargs['matricula']} já existe")
        
        # Valida turma se for atualizada
        if 'turma_id' in kwargs:
            kwargs['turma'] = Turma.objects.get(id=kwargs.pop('turma_id'))
        elif 'turma' in kwargs and not isinstance(kwargs['turma'], Turma):
            kwargs['turma'] = Turma.objects.get(id=kwargs['turma'])
        
        for key, value in kwargs.items():
            setattr(aluno, key, value)
        aluno.save()
        return aluno
    
    @staticmethod
    def deletar_aluno(aluno_id):
        """Deleta um aluno"""
        aluno = Aluno.objects.get(id=aluno_id)
        aluno.delete()
    
    @staticmethod
    def listar_alunos(turma_id=None):
        """Lista alunos, opcionalmente filtrados por turma"""
        queryset = Aluno.objects.all()
        if turma_id:
            queryset = queryset.filter(turma_id=turma_id)
        return queryset
    
    @staticmethod
    def obter_aluno(aluno_id):
        """Obtém um aluno específico"""
        return Aluno.objects.get(id=aluno_id)

