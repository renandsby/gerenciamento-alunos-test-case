from django.contrib import admin
from .models import Turma, Aluno


@admin.register(Turma)
class TurmaAdmin(admin.ModelAdmin):
    list_display = ['nome', 'ano_letivo', 'turno']
    list_filter = ['ano_letivo', 'turno']
    search_fields = ['nome']


@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = ['nome', 'matricula', 'email', 'data_nascimento', 'turma']
    list_filter = ['turma']
    search_fields = ['nome', 'matricula', 'email']

