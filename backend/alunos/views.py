from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound, ValidationError
from .models import Turma, Aluno
from .serializers import (
    TurmaSerializer,
    TurmaListSerializer,
    AlunoSerializer,
    AlunoListSerializer
)
from .services import TurmaService, AlunoService
from .pagination import AlunoPagination
from .filters import AlunoFilter


class TurmaViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciamento de turmas"""
    permission_classes = [IsAuthenticated]
    queryset = Turma.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TurmaListSerializer
        return TurmaSerializer
    
    def create(self, request):
        try:
            turma = TurmaService.criar_turma(
                nome=request.data.get('nome'),
                ano_letivo=request.data.get('ano_letivo'),
                turno=request.data.get('turno')
            )
            serializer = self.get_serializer(turma)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValueError as e:
            raise ValidationError({'error': str(e)})
    
    def update(self, request, pk=None):
        try:
            turma = TurmaService.atualizar_turma(pk, **request.data)
            serializer = self.get_serializer(turma)
            return Response(serializer.data)
        except Turma.DoesNotExist:
            raise NotFound('Turma não encontrada')
        except ValueError as e:
            raise ValidationError({'error': str(e)})
    
    def destroy(self, request, pk=None):
        try:
            TurmaService.deletar_turma(pk)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Turma.DoesNotExist:
            raise NotFound('Turma não encontrada')
        except ValueError as e:
            raise ValidationError({'error': str(e)})
    
    @action(detail=True, methods=['get'])
    def alunos(self, request, pk=None):
        """Retorna todos os alunos de uma turma"""
        alunos = AlunoService.listar_alunos(turma_id=pk)
        serializer = AlunoListSerializer(alunos, many=True)
        return Response(serializer.data)


class AlunoViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciamento de alunos"""
    permission_classes = [IsAuthenticated]
    queryset = Aluno.objects.all()
    pagination_class = AlunoPagination
    filterset_class = AlunoFilter
    
    def get_serializer_class(self):
        if self.action == 'list':
            return AlunoListSerializer
        return AlunoSerializer
    
    def create(self, request):
        try:
            aluno = AlunoService.criar_aluno(
                nome=request.data.get('nome'),
                email=request.data.get('email'),
                matricula=request.data.get('matricula'),
                data_nascimento=request.data.get('data_nascimento'),
                turma_id=request.data.get('turma')
            )
            serializer = self.get_serializer(aluno)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValueError as e:
            raise ValidationError({'error': str(e)})
    
    def update(self, request, pk=None):
        try:
            aluno = AlunoService.atualizar_aluno(pk, **request.data)
            serializer = self.get_serializer(aluno)
            return Response(serializer.data)
        except Aluno.DoesNotExist:
            raise NotFound('Aluno não encontrado')
        except ValueError as e:
            raise ValidationError({'error': str(e)})
    
    def destroy(self, request, pk=None):
        try:
            AlunoService.deletar_aluno(pk)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Aluno.DoesNotExist:
            raise NotFound('Aluno não encontrado')

