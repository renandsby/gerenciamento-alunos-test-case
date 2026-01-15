import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { turmasAPI } from '../services/api';
import NavBar from './NavBar';

function TurmasList() {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadTurmas();
  }, []);

  const loadTurmas = async () => {
    try {
      const data = await turmasAPI.listar();
      // Garante que data seja sempre um array
      setTurmas(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Erro ao carregar turmas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta turma? Todos os alunos da turma também serão deletados.')) {
      try {
        await turmasAPI.deletar(id);
        loadTurmas();
      } catch (err) {
        setError('Erro ao deletar turma');
      }
    }
  };

  const getTurnoColor = (turno) => {
    const colors = {
      'manha': 'warning',
      'tarde': 'info',
      'noite': 'dark'
    };
    return colors[turno] || 'secondary';
  };

  return (
    <>
      <NavBar />
      <Container className="main-content">
        <div className="page-header">
          <div className="d-flex justify-content-between align-items-center">
            <h1>Turmas</h1>
            <Button variant="primary" onClick={() => navigate('/turmas/nova')}>
              Nova Turma
            </Button>
          </div>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <p>Carregando...</p>
        ) : turmas.length === 0 ? (
          <Alert variant="info">
            Nenhuma turma cadastrada. Clique em "Nova Turma" para começar.
          </Alert>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Ano Letivo</th>
                  <th>Turno</th>
                  <th>Total de Alunos</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {turmas.map((turma) => (
                  <tr key={turma.id}>
                    <td>{turma.nome}</td>
                    <td>{turma.ano_letivo}</td>
                    <td>
                      <Badge bg={getTurnoColor(turma.turno)}>
                        {turma.turno_display}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="primary">{turma.total_alunos}</Badge>
                    </td>
                    <td>
                      <div className="btn-group-actions">
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => navigate(`/turmas/${turma.id}`)}
                        >
                          Ver Alunos
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => navigate(`/turmas/${turma.id}/editar`)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(turma.id)}
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

export default TurmasList;

