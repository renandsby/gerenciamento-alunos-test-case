from django.db import models


class Turma(models.Model):
    TURNO_CHOICES = [
        ('manha', 'Manhã'),
        ('tarde', 'Tarde'),
        ('noite', 'Noite'),
    ]
    
    nome = models.CharField(max_length=100)
    ano_letivo = models.IntegerField()
    turno = models.CharField(max_length=20, choices=TURNO_CHOICES)
    
    class Meta:
        ordering = ['ano_letivo', 'nome']
        verbose_name = 'Turma'
        verbose_name_plural = 'Turmas'
    
    def __str__(self):
        return f"{self.nome} - {self.ano_letivo} ({self.get_turno_display()})"


class Aluno(models.Model):
    nome = models.CharField(max_length=200)
    email = models.EmailField()
    matricula = models.CharField(max_length=50, unique=True)
    data_nascimento = models.DateField()
    turma = models.ForeignKey(
        Turma,
        on_delete=models.CASCADE,
        related_name='alunos'
    )
    
    class Meta:
        ordering = ['nome']
        verbose_name = 'Aluno'
        verbose_name_plural = 'Alunos'
    
    def __str__(self):
        return f"{self.nome} ({self.matricula})"

