from rest_framework import serializers
from .models import Turma, Aluno


class AlunoListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de alunos"""
    turma_nome = serializers.CharField(source='turma.nome', read_only=True)
    
    class Meta:
        model = Aluno
        fields = ['id', 'nome', 'email', 'matricula', 'data_nascimento', 'turma', 'turma_nome']


class AlunoSerializer(serializers.ModelSerializer):
    """Serializer completo para aluno"""
    turma_nome = serializers.CharField(source='turma.nome', read_only=True)
    
    class Meta:
        model = Aluno
        fields = ['id', 'nome', 'email', 'matricula', 'data_nascimento', 'turma', 'turma_nome']
    
    def validate_matricula(self, value):
        """Valida unicidade da matrícula"""
        instance = self.instance
        if instance and instance.matricula == value:
            return value
        
        if Aluno.objects.filter(matricula=value).exists():
            raise serializers.ValidationError("Esta matrícula já está em uso.")
        return value


class TurmaListSerializer(serializers.ModelSerializer):
    """Serializer para listagem de turmas"""
    total_alunos = serializers.IntegerField(source='alunos.count', read_only=True)
    turno_display = serializers.CharField(source='get_turno_display', read_only=True)
    
    class Meta:
        model = Turma
        fields = ['id', 'nome', 'ano_letivo', 'turno', 'turno_display', 'total_alunos']


class TurmaSerializer(serializers.ModelSerializer):
    """Serializer completo para turma com alunos"""
    alunos = AlunoListSerializer(many=True, read_only=True)
    total_alunos = serializers.IntegerField(source='alunos.count', read_only=True)
    turno_display = serializers.CharField(source='get_turno_display', read_only=True)
    
    class Meta:
        model = Turma
        fields = ['id', 'nome', 'ano_letivo', 'turno', 'turno_display', 'total_alunos', 'alunos']

