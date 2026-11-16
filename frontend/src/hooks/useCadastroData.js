import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api.js';

// Carrega os registros do cadastro escolhido e os cadastros usados como referência nos seus campos
export function useCadastroData(cadastro) {
  const [records, setRecords] = useState([]);
  const [references, setReferences] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      // Caminhos dos cadastros referenciados pelos campos
      const referencePaths = cadastro.fields
        .filter((field) => field.type === 'reference')
        .map((field) => field.refPath);

      // Busca o cadastro e as referências ao mesmo tempo
      const [recordsResponse, ...referenceResponses] = await Promise.all([
        api.get(`/${cadastro.path}`),
        ...referencePaths.map((path) => api.get(`/${path}`)),
      ]);

      setRecords(recordsResponse.data);
      setReferences(
        Object.fromEntries(referencePaths.map((path, index) => [path, referenceResponses[index].data]))
      );
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível carregar os dados');
    } finally {
      setIsLoading(false);
    }
  }, [cadastro]);

  // Recarrega sempre que o cadastro escolhido muda
  useEffect(() => {
    load();
  }, [load]);

  return { records, references, isLoading, error, reload: load };
}
