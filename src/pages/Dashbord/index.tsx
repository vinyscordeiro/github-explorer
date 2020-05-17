import React, { useState, useEffect, FormEvent } from 'react';
import { Title, Form, Repositories, Error } from './styles';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logoApp.svg';
import { FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

interface Repository {
  full_name: string;
  description:string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashbord: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError ] = useState('');
  const [repositories, setRepositories]=useState<Repository[]>(()=>{
    const storagedRepositories =
    localStorage.getItem('@GithubExplorer:Repositories');
    if( storagedRepositories ) {
      return JSON.parse( storagedRepositories );
    }else{
      return [];
    }
  });

  useEffect(()=>{
    localStorage.setItem(
      '@GithubExplorer:Repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  async function handleAddRepository(event:FormEvent<HTMLFormElement> ): Promise<void> {
    // Adicionar um repositório
    // Consultar a API do Github
    // Adicionar o repositorio no estado
    event.preventDefault();

    if(!newRepo){
      setInputError('Digite o nome do autor / nome do repositório');
      return;
    }
    try{
      const response = await api.get<Repository>(`repos/${newRepo}`);

      console.log(response.data);
      const repository = response.data;
      setRepositories([...repositories,repository]);
      setNewRepo('');
      setInputError('');
    }catch(err){
      setInputError('Erro ao buscar o repositório');
    }
  }
  return (
    <>
      <img src={logoImg} alt='Github Explorer'/>
      <Title>Explore repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(e)=>setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório" />
        <button type="submit">Pesquisar</button>
      </Form>
        { inputError && <Error>{inputError}</Error> }


      <Repositories>
        {repositories.map(repository =>(
          <Link key={repository.full_name}
          to={`/repository/${repository.full_name}`}>

          <img src={repository.owner.avatar_url}
          alt={repository.owner.login}/>
          <div>
          <strong>{repository.full_name}</strong>
            <p>{repository.description}</p>
          </div>

          <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  )
}
export default Dashbord;
