import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { alunosAPI, turmasAPI } from '../services/api';
import NavBar from './NavBar';

function AlunoForm() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    matricula: '',
    data_nascimento: '',
    turma: ''
  });
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const origem = searchParams.get('origem');
  const turmaIdFromUrl = searchParams.get('turma');

  const navegarVoltar = () => {
    if (origem === 'dashboard') {
      navigate('/');
    } else if (turmaIdFromUrl) {
      navigate(`/turmas/${turmaIdFromUrl}`);
    } else if (formData.turma) {
      navigate(`/turmas/${formData.turma}`);
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    loadTurmas();
    if (id) {
      setIsEdit(true);
      loadAluno();
    } else if (turmaIdFromUrl) {
      setFormData(prev => ({ ...prev, turma: turmaIdFromUrl }));
    }
  }, [id, turmaIdFromUrl]);

  const loadTurmas = async () => {
    try {
      const data = await turmasAPI.listar();
      setTurmas(data);
    } catch (err) {
      setError('Erro ao carregar turmas');
    }
  };

  const loadAluno = async () => {
    try {
      const data = await alunosAPI.obter(id);
      setFormData({
        nome: data.nome,
        email: data.email,
        matricula: data.matricula,
        data_nascimento: data.data_nascimento,
        turma: data.turma
      });
    } catch (err) {
      setError('Erro ao carregar aluno');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'turma' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await alunosAPI.atualizar(id, formData);
      } else {
        await alunosAPI.criar(formData);
      }
      
      navegarVoltar();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar aluno');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <Container className="main-content">
        <Button 
          variant="secondary" 
          className="mb-3" 
          onClick={navegarVoltar}
        >
          ← Voltar
        </Button>

        <Card>
          <Card.Body>
            <h2 className="mb-4">{isEdit ? 'Editar' : 'Novo'} Aluno</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nome Completo</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Nome completo do aluno"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@exemplo.com"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Matrícula</Form.Label>
                <Form.Control
                  type="text"
                  name="matricula"
                  value={formData.matricula}
                  onChange={handleChange}
                  placeholder="Número de matrícula"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Data de Nascimento</Form.Label>
                <Form.Control
                  type="date"
                  name="data_nascimento"
                  value={formData.data_nascimento}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Turma</Form.Label>
                <Form.Select
                  name="turma"
                  value={formData.turma}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione uma turma</option>
                  {turmas.map(turma => (
                    <option key={turma.id} value={turma.id}>
                      {turma.nome} - {turma.ano_letivo} ({turma.turno_display})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={navegarVoltar}
                >
                  Cancelar
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default AlunoForm;

