import { ChangeEvent, useState } from 'react';
import { read, utils } from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

export default function App(): JSX.Element {
  const [state, setState] = useState({
    file: null,
    column: '',
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    setState((prevState: any) => ({
      ...prevState,
      file,
    }));
  };

  const handleExportClick = () => {
    if (!state.file) {
      toast.error('Precisamos de um arquivo com a extensão .xlsx', {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }

    const fileReader: FileReader = new FileReader();
    fileReader.onload = (): void => {
      const data = fileReader.result;
      const workbook = read(data, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const columnData = utils.sheet_to_json(worksheet, {
        header: 1,
        range: 1,
      });
      const csvData = columnData
        .map((row: any) => {
          const print = `${row[1]}`;
          if (row.length > 0) return print;
          return null;
        })
        .join(',');
      const blob = new Blob([`python 2_register_rides.py --os=${csvData}`], {
        type: 'text/plain;charset=utf-8',
      });
      saveAs(blob, 'robo.txt');
    };
    fileReader.readAsBinaryString(state.file);
    toast.success('Arquivo Baixado com Sucesso', {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  };

  return (
    <>
      <div className="container">
        <h1>Conversor de Arquivos XLSX para TXT</h1>
        <h2>Este conversor, é voltado exclusivamente para O Robo da Portosocorro</h2>
        <h3>Ele pega as Ordems de Serviço especificamente!</h3>
        <div className="title">
          <label htmlFor="file">Arquivo XLSX:</label>
          <input type="file" id="file" onChange={handleFileChange} />
        </div>
        <button className="btn draw-border" onClick={handleExportClick}>
          Exportar
        </button>
        <p>Feito com &#x2764; por Douglas</p>
        <ToastContainer />
      </div>
    </>
  );
}
