import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Alert, Badge } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { turmasAPI, alunosAPI } from '../services/api';
import NavBar from './NavBar';

function TurmaDetail() {
  const [turma, setTurma] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [turmaData, alunosData] = await Promise.all([
        turmasAPI.obter(id),
        turmasAPI.obterAlunos(id)
      ]);
      setTurma(turmaData);
      setAlunos(Array.isArray(alunosData) ? alunosData : []);
      setError('');
    } catch (err) {
      setError('Erro ao carregar dados da turma');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAluno = async (alunoId) => {
    if (window.confirm('Tem certeza que deseja deletar este aluno?')) {
      try {
        await alunosAPI.deletar(alunoId);
        loadData();
      } catch (err) {
        setError('Erro ao deletar aluno');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) return <><NavBar /><Container className="main-content"><p>Carregando...</p></Container></>;
  if (!turma) return <><NavBar /><Container className="main-content"><Alert variant="danger">Turma não encontrada</Alert></Container></>;

  return (
    <>
      <NavBar />
      <Container className="main-content">
        <Button variant="secondary" className="mb-3" onClick={() => navigate('/turmas')}>
          ← Voltar
        </Button>

        {error && <Alert variant="danger">{error}</Alert>}

        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h2>{turma.nome}</h2>
                <p className="text-muted mb-2">
                  Ano Letivo: {turma.ano_letivo} | Turno: <Badge bg="info">{turma.turno_display}</Badge>
                </p>
                <p className="mb-0">
                  Total de Alunos: <Badge bg="primary">{turma.total_alunos}</Badge>
                </p>
              </div>
              <Button
                variant="warning"
                onClick={() => navigate(`/turmas/${id}/editar`)}
              >
                Editar Turma
              </Button>
            </div>
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Alunos da Turma</h3>
          <Button
            variant="success"
            onClick={() => navigate(`/alunos/novo?turma=${id}`)}
          >
            Adicionar Aluno
          </Button>
        </div>

        {alunos.length === 0 ? (
          <Alert variant="info">
            Nenhum aluno cadastrado nesta turma.
          </Alert>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Matrícula</th>
                  <th>Email</th>
                  <th>Data de Nascimento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {alunos.map((aluno) => (
                  <tr key={aluno.id}>
                    <td>{aluno.nome}</td>
                    <td>{aluno.matricula}</td>
                    <td>{aluno.email}</td>
                    <td>{formatDate(aluno.data_nascimento)}</td>
                    <td>
                      <div className="btn-group-actions">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => navigate(`/alunos/${aluno.id}/editar?origem=turma&turma=${id}`)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteAluno(aluno.id)}
                        >
                          Deletar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </>
  );
}

export default TurmaDetail;

