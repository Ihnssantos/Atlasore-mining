import { useState } from 'react';
import { buildInitialValues, buildPayload } from '../cadastros/cadastroHelpers.jsx';
import './CadastroForm.css';

// Controle de um campo do formulário, escolhido de acordo com o tipo do campo
function FieldInput({ field, value, onChange, references, record, isEditing }) {
  // Na edição a senha é opcional, e os demais campos são obrigatórios, exceto os marcados como opcionais
  const isRequired = field.required !== false && !(field.type === 'password' && isEditing);

  // Lista com os registros ativos de outro cadastro, mantendo o atual mesmo que esteja inativo
  if (field.type === 'reference') {
    const options = (references[field.refPath] ?? []).filter(
      (item) => item.status || item.id === record?.[field.name]
    );

    return (
      <select value={value} onChange={(event) => onChange(event.target.value)} required={isRequired}>
        <option value="">Selecione</option>
        {options.map((item) => (
          <option key={item.id} value={item.id}>
            {item.nome}
          </option>
        ))}
      </select>
    );
  }

  // Lista com valores fixos
  if (field.type === 'select') {
    return (
      <select value={value} onChange={(event) => onChange(event.target.value)} required={isRequired}>
        <option value="">Selecione</option>
        {field.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  // Texto, e-mail, senha e número usam o input com o tipo do próprio campo
  return (
    <input
      type={field.type}
      step={field.step}
      value={value}
      required={isRequired}
      placeholder={field.type === 'password' && isEditing ? 'Deixe em branco para manter' : ''}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

// Formulário em janela para criar um registro ou editar o que foi recebido em record
export default function CadastroForm({ cadastro, record, references, onSubmit, onCancel }) {
  const isEditing = Boolean(record);
  const [values, setValues] = useState(() => buildInitialValues(cadastro, record));
  const [status, setStatus] = useState(record?.status ?? true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Atualiza o valor de um único campo
  function handleChange(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  // Envia o formulário e mostra a mensagem de erro da API, se houver
  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await onSubmit(buildPayload(cadastro, values, { isEditing, status }));
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível salvar');
      setIsSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={handleSubmit}>
        <h2>
          {isEditing ? 'Editar' : 'Novo'} {cadastro.singular}
        </h2>

        {cadastro.fields.map((field) => (
          <label key={field.name} className="form-field">
            <span>{field.label}</span>
            <FieldInput
              field={field}
              value={values[field.name]}
              onChange={(value) => handleChange(field.name, value)}
              references={references}
              record={record}
              isEditing={isEditing}
            />
          </label>
        ))}

        {/* O status só aparece na edição, porque todo registro novo nasce ativo */}
        {isEditing && (
          <label className="form-check">
            <input type="checkbox" checked={status} onChange={(event) => setStatus(event.target.checked)} />
            Ativo
          </label>
        )}

        {error && <p className="message-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="button" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="button button-primary" disabled={isSaving}>
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
