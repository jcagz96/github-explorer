import React, { useState, FormEvent, useCallback, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Title, Form, Error, Repositories } from './styles';
import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storedRepositories = localStorage.getItem(
      '@GithubExplorer:repositories',
    );
    if (storedRepositories) {
      return JSON.parse(storedRepositories);
    }

    return [];
  });

  const handleAddRepository = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      if (!newRepo) {
        setInputError('Digite autor/nome do repositório');
        return;
      }

      try {
        const response = await api.get<Repository>(`repos/${newRepo}`);
        const repository = response.data;
        setRepositories([...repositories, repository]);
        setNewRepo('');
        setInputError('');
      } catch (error) {
        setInputError('Erro na busca por esse repositório');
      }
    },
    [newRepo, repositories],
  );

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  return (
    <>
      <Link to="/">
        <img src={logoImg} alt="Github Explorer" />
      </Link>
      <Title>Explore os repositorios no github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map((repository) => (
          <Link
            key={repository.full_name}
            to={`/repository/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
