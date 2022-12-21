import FileSaver from 'file-saver';

export const saveFile = (content: string, fileName: string) => {
  const blob = new Blob([content], {
    type: 'text/plain;charset=utf-8',
  });

  FileSaver.saveAs(blob, fileName);
};
