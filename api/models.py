from django.db import models

# Create your models here.
class Task(models.Model):
    STATUS_CHOICES = [
        ('TODO', 'A Fazer'),
        ('IN_PROGRESS', 'Em Progresso'),
        ('DONE', 'Concluído'),
    ]

    PRIORITY_CHOICES = [
        ('LOW', 'Baixa'),
        ('MEDIUM', 'Média'),
        ('HIGH', 'Alta'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='TODO')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='MEDIUM')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title