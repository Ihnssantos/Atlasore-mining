import { useState } from 'react';
import { cadastros } from '../cadastros/cadastros.js';
import { buildInitialValues, buildPayload, getColumns } from '../cadastros/cadastroHelpers.jsx';
import { useCadastroData } from '../hooks/useCadastroData.js';
import { api } from '../services/api.js';
import CadastroForm from '../components/CadastroForm.jsx';
import DataTable from '../components/DataTable.jsx';
import './Cadastros.css';

// Estado inicial da janela do formulário: fechada
const CLOSED_FORM = { isOpen: false, record: null };

// Tela que lista, cria, edita e ativa ou inativa os registros de qualquer cadastro
export default function Cadastros() {
  const [cadastro, setCadastro] = useState(cadastros[0]);
  const [form, setForm] = useState(CLOSED_FORM);
  const [actionError, setActionError] = useState('');
  const { records, references, isLoading, error, reload } = useCadastroData(cadastro);

  // Troca o cadastro mostrado e descarta o que estava aberto no anterior
  function selectCadastro(item) {
    setCadastro(item);
    setForm(CLOSED_FORM);
    setActionError('');
  }

  // Cria ou atualiza o registro e, se der certo, fecha a janela e recarrega a lista
  async function handleSave(payload) {
    if (form.record) {
      await api.put(`/${cadastro.path}/${form.record.id}`, payload);
    } else {
      await api.post(`/${cadastro.path}`, payload);
    }

    setForm(CLOSED_FORM);
    await reload();
  }

  // Inverte o status do registro, reenviando os campos atuais dele
  async function handleToggleStatus(record) {
    setActionError('');

    try {
      const values = buildInitialValues(cadastro, record);
      const payload = buildPayload(cadastro, values, { isEditing: true, status: !record.status });

      await api.put(`/${cadastro.path}/${record.id}`, payload);
      await reload();
    } catch (err) {
      setActionError(err.response?.data?.message ?? 'Não foi possível alterar o status');
    }
  }

  return (
    <div>
      <h1>Cadastros</h1>
      <p className="page-subtitle">Gerencie os cadastros do sistema</p>

      {/* Um botão para cada cadastro, com destaque no escolhido */}
      <div className="tabs">
        {cadastros.map((item) => (
          <button
            key={item.path}
            className={item.path === cadastro.path ? 'tab tab-active' : 'tab'}
            onClick={() => selectCadastro(item)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="card">
        <header className="card-header">
          <h2>{cadastro.label}</h2>
          <button className="button button-primary" onClick={() => setForm({ isOpen: true, record: null })}>
            Novo
          </button>
        </header>

        {error && <p className="message-error">{error}</p>}
        {actionError && <p className="message-error">{actionError}</p>}

        {isLoading ? (
          <p className="table-empty">Carregando...</p>
        ) : (
          <DataTable
            columns={getColumns(cadastro, references)}
            rows={records}
            renderActions={(record) => (
              <>
                <button className="button" onClick={() => setForm({ isOpen: true, record })}>
                  Editar
                </button>
                <button className="button" onClick={() => handleToggleStatus(record)}>
                  {record.status ? 'Inativar' : 'Ativar'}
                </button>
              </>
            )}
          />
        )}
      </section>

      {/* A chave recria o formulário a cada registro, para não reaproveitar valores antigos */}
      {form.isOpen && (
        <CadastroForm
          key={form.record?.id ?? 'novo'}
          cadastro={cadastro}
          record={form.record}
          references={references}
          onSubmit={handleSave}
          onCancel={() => setForm(CLOSED_FORM)}
        />
      )}
    </div>
  );
}
