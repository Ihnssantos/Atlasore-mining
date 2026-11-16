import './DataTable.css';

// Tabela genérica: cada coluna sabe como mostrar o seu valor, e as ações de cada linha vêm de fora
export default function DataTable({ columns, rows, renderActions }) {
  if (rows.length === 0) {
    return <p className="table-empty">Nenhum registro encontrado</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.key}>{column.render(row)}</td>
              ))}
              <td className="table-actions">{renderActions(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
