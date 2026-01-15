import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { turmasAPI } from '../services/api';
import NavBar from './NavBar';

function TurmaForm() {
  const [formData, setFormData] = useState({
    nome: '',
    ano_letivo: new Date().getFullYear(),
    turno: 'manha'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      loadTurma();
    }
  }, [id]);

  const loadTurma = async () => {
    try {
      const data = await turmasAPI.obter(id);
      setFormData({
        nome: data.nome,
        ano_letivo: data.ano_letivo,
        turno: data.turno
      });
    } catch (err) {
      setError('Erro ao carregar turma');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ano_letivo' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await turmasAPI.atualizar(id, formData);
      } else {
        await turmasAPI.criar(formData);
      }
      navigate('/turmas');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar turma');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <Container className="main-content">
        <Button variant="secondary" className="mb-3" onClick={() => navigate('/turmas')}>
          ← Voltar
        </Button>

        <Card>
          <Card.Body>
            <h2 className="mb-4">{isEdit ? 'Editar' : 'Nova'} Turma</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nome da Turma</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: 1º Ano A"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ano Letivo</Form.Label>
                <Form.Control
                  type="number"
                  name="ano_letivo"
                  value={formData.ano_letivo}
                  onChange={handleChange}
                  min="2000"
                  max="2100"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Turno</Form.Label>
                <Form.Select
                  name="turno"
                  value={formData.turno}
                  onChange={handleChange}
                  required
                >
                  <option value="manha">Manhã</option>
                  <option value="tarde">Tarde</option>
                  <option value="noite">Noite</option>
                </Form.Select>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button variant="secondary" onClick={() => navigate('/turmas')}>
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

export default TurmaForm;

