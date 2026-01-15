import django_filters
from .models import Aluno


class AlunoFilter(django_filters.FilterSet):
    turma = django_filters.NumberFilter(field_name='turma', lookup_expr='exact')
    nome = django_filters.CharFilter(field_name='nome', lookup_expr='icontains')
    
    class Meta:
        model = Aluno
        fields = ['turma', 'nome']

