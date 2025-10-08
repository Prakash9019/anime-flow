// hooks/useMalList.ts
import { useState, useEffect } from 'react';
import MalService from '../services/MailService';
import { AnimeNode } from '../types/anime';

export function useMalList(status?: string) {
  const [list, setList] = useState<AnimeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    MalService.init()
      .then(() => MalService.getUserList(status))
      .then(setList)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [status]);

  return { list, loading, error };
}
