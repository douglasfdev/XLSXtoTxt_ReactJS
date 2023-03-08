import { useState } from "react";
import { read, utils } from 'xlsx';
import * as FileSaver from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

export default function App() {
  const [state, setState] = useState(
    {
      file: null,
      column: '',
    });

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setState((prevState) => ({
      ...prevState,
      file,
    }));
  };

  const handleExportClick = () => {
    if (!state.file) {
      alert('Please select a file to export');
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const data = event.target.result;
      const workbook = read(data, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const columnData = utils.sheet_to_json(worksheet, {
        header: 1,
      });
      const csvData = columnData.map(row => `${row[1]}`).join('\n');
      const blob = new Blob([csvData], { type: 'text/plain;charset=utf-8' });
      FileSaver.saveAs(blob, 'export.txt');
    };
    fileReader.readAsBinaryString(state.file);
    toast("Arquivo Baixado com Sucesso");
  };

  return (
    <>
    <div className="container title">
      <h1>Conversor de Arquivos XLSX para TXT</h1>
      <div className="title">
        <label htmlFor="file">Arquivo XLSX:</label>
        <input type="file" id="file" onChange={handleFileChange} />
      </div>
      <button className="btn draw-border" onClick={handleExportClick}>
        Exportar
      </button>
      <ToastContainer />
    </div>
    </>
  );
};
