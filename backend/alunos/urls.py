from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TurmaViewSet, AlunoViewSet

router = DefaultRouter()
router.register(r'turmas', TurmaViewSet, basename='turma')
router.register(r'alunos', AlunoViewSet, basename='aluno')

urlpatterns = [
    path('', include(router.urls)),
]

