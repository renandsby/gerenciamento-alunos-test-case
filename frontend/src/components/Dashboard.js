import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Pagination, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { turmasAPI, alunosAPI, authAPI } from '../services/api';
import NavBar from './NavBar';

function Dashboard() {
  const [stats, setStats] = useState({
    totalTurmas: 0,
    totalAlunos: 0
  });
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [turmaFiltro, setTurmaFiltro] = useState('');
  const [buscaNome, setBuscaNome] = useState('');
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [turmasData, alunosData] = await Promise.all([
        turmasAPI.listar(),
        alunosAPI.listar(null, 1)
      ]);
      
      const turmasArray = Array.isArray(turmasData) ? turmasData : [];
      setTurmas(turmasArray);
      
      if (alunosData.results) {
        setAlunos(alunosData.results);
        setPagination({
          count: alunosData.count || 0,
          next: alunosData.next,
          previous: alunosData.previous,
          currentPage: 1,
          totalPages: Math.ceil((alunosData.count || 0) / 20)
        });
        setStats({
          totalTurmas: turmasArray.length,
          totalAlunos: alunosData.count || 0
        });
      } else {
        const alunosArray = Array.isArray(alunosData) ? alunosData : [];
        setAlunos(alunosArray);
        setPagination({
          count: alunosArray.length,
          next: null,
          previous: null,
          currentPage: 1,
          totalPages: 1
        });
        setStats({
          totalTurmas: turmasArray.length,
          totalAlunos: alunosArray.length
        });
      }
      setError('');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const turmas = await turmasAPI.listar();
      const turmasArray = Array.isArray(turmas) ? turmas : [];
      setStats(prev => ({
        ...prev,
        totalTurmas: turmasArray.length,
        totalAlunos: pagination.count
      }));
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const loadAlunos = async (page = 1, turmaId = null, nome = null) => {
    try {
      setLoading(true);
      const turmaIdToUse = turmaId !== null ? turmaId : (turmaFiltro || null);
      const nomeToUse = nome !== null ? nome : (buscaNome || null);
      const response = await alunosAPI.listar(turmaIdToUse, page, nomeToUse);
      
      if (response.results) {
        setAlunos(response.results);
        setPagination({
          count: response.count || 0,
          next: response.next,
          previous: response.previous,
          currentPage: page,
          totalPages: Math.ceil((response.count || 0) / 20)
        });
      } else {
        setAlunos(Array.isArray(response) ? response : []);
        setPagination({
          count: Array.isArray(response) ? response.length : 0,
          next: null,
          previous: null,
          currentPage: 1,
          totalPages: 1
        });
      }
      setError('');
    } catch (err) {
      setError('Erro ao carregar lista de alunos');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    loadAlunos(page);
  };

  const handleTurmaFiltroChange = (e) => {
    const turmaId = e.target.value || '';
    setTurmaFiltro(turmaId);
  };

  const handleBuscaNomeChange = (e) => {
    const nome = e.target.value;
    setBuscaNome(nome);
  };

  const handleAplicarFiltros = () => {
    loadAlunos(1, turmaFiltro || null, buscaNome || null);
  };

  const handleDeleteAluno = async (alunoId) => {
    if (window.confirm('Tem certeza que deseja deletar este aluno?')) {
      try {
        await alunosAPI.deletar(alunoId);
        
        let pageToLoad = pagination.currentPage;
        const newTotalPages = Math.ceil((pagination.count - 1) / 20);
        
        if (pagination.currentPage > newTotalPages && newTotalPages > 0) {
          pageToLoad = newTotalPages;
        }
        
        const turmaIdToUse = turmaFiltro || null;
        const nomeToUse = buscaNome || null;
        const response = await alunosAPI.listar(turmaIdToUse, pageToLoad, nomeToUse);
        
        if (response.results) {
          setAlunos(response.results);
          setPagination({
            count: response.count || 0,
            next: response.next,
            previous: response.previous,
            currentPage: pageToLoad,
            totalPages: Math.ceil((response.count || 0) / 20)
          });
          setStats(prev => ({
            ...prev,
            totalAlunos: response.count || 0
          }));
        }
      } catch (err) {
        setError('Erro ao deletar aluno');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <>
      <NavBar />
      <Container className="main-content">
        <div className="page-header">
          <h1>Página Inicial</h1>
          <p className="text-muted">Bem-vindo, {authAPI.getUsername()}!</p>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            <Row className="mb-4">
              <Col md={6} className="mb-3">
                <Card className="dashboard-card h-100" onClick={() => navigate('/turmas')}>
                  <Card.Body>
                    <Card.Title>Turmas</Card.Title>
                    <h2 className="text-primary">{stats.totalTurmas}</h2>
                    <Card.Text>Total de turmas cadastradas</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-3">
                <Card className="dashboard-card h-100">
                  <Card.Body>
                    <Card.Title>Alunos</Card.Title>
                    <h2 className="text-success">{stats.totalAlunos}</h2>
                    <Card.Text>Total de alunos cadastrados</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col md={12}>
                <Card>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Card.Title className="mb-0">Lista de Alunos</Card.Title>
                      <div className="d-flex gap-2 align-items-center">
                        <Form.Control
                          type="text"
                          placeholder="Buscar por nome..."
                          value={buscaNome}
                          onChange={handleBuscaNomeChange}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAplicarFiltros();
                            }
                          }}
                          style={{ width: 'auto', minWidth: '350px' }}
                        />
                        <Form.Select
                          style={{ width: 'auto', minWidth: '200px' }}
                          value={turmaFiltro}
                          onChange={handleTurmaFiltroChange}
                        >
                          <option value="">Todas as turmas</option>
                          {turmas.map(turma => (
                            <option key={turma.id} value={turma.id}>
                              {turma.nome} - {turma.ano_letivo}
                            </option>
                          ))}
                        </Form.Select>
                        <Button
                          variant="primary"
                          onClick={handleAplicarFiltros}
                        >
                          Filtrar
                        </Button>
                        <Button
                          variant="success"
                          onClick={() => navigate('/alunos/novo?origem=dashboard')}
                        >
                          Adicionar Aluno
                        </Button>
                      </div>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    {alunos.length === 0 && !loading ? (
                      <Alert variant="info">
                        Nenhum aluno cadastrado.
                      </Alert>
                    ) : (
                      <>
                        <div className="table-responsive">
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>Nome</th>
                                <th>Matrícula</th>
                                <th>Email</th>
                                <th>Data de Nascimento</th>
                                <th>Turma</th>
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
                                  <td>{aluno.turma_nome || '-'}</td>
                                  <td>
                                    <div className="btn-group-actions">
                                      <Button
                                        variant="warning"
                                        size="sm"
                                        onClick={() => navigate(`/alunos/${aluno.id}/editar?origem=dashboard`)}
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
                        
                        {pagination.totalPages > 1 && (
                          <div className="d-flex justify-content-center mt-3">
                            <Pagination>
                              <Pagination.First 
                                disabled={!pagination.previous} 
                                onClick={() => handlePageChange(1)}
                              />
                              <Pagination.Prev 
                                disabled={!pagination.previous} 
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                              />
                              
                              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                .filter(page => {
                                  return (
                                    page === 1 ||
                                    page === pagination.totalPages ||
                                    (page >= pagination.currentPage - 2 && page <= pagination.currentPage + 2)
                                  );
                                })
                                .map((page, index, array) => {
                                  if (index > 0 && page - array[index - 1] > 1) {
                                    return (
                                      <React.Fragment key={page}>
                                        <Pagination.Ellipsis />
                                        <Pagination.Item
                                          active={page === pagination.currentPage}
                                          onClick={() => handlePageChange(page)}
                                        >
                                          {page}
                                        </Pagination.Item>
                                      </React.Fragment>
                                    );
                                  }
                                  return (
                                    <Pagination.Item
                                      key={page}
                                      active={page === pagination.currentPage}
                                      onClick={() => handlePageChange(page)}
                                    >
                                      {page}
                                    </Pagination.Item>
                                  );
                                })}
                              
                              <Pagination.Next 
                                disabled={!pagination.next} 
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                              />
                              <Pagination.Last 
                                disabled={!pagination.next} 
                                onClick={() => handlePageChange(pagination.totalPages)}
                              />
                            </Pagination>
                          </div>
                        )}
                        
                        {pagination.count > 0 && (
                          <div className="text-center mt-2 text-muted">
                            Mostrando {((pagination.currentPage - 1) * 20) + 1} a {Math.min(pagination.currentPage * 20, pagination.count)} de {pagination.count} alunos
                          </div>
                        )}
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
}

export default Dashboard;

