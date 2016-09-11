export const openFile = (accept, cb) => {
  const element = document.createElement('input');

  element.setAttribute('type', 'file');
  element.setAttribute('accept', accept);

  element.addEventListener('change', e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      cb(reader.result);
    };

    reader.readAsText(file);
  });

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const saveFile = (filename, text) => {
  const encodedText = encodeURIComponent(text);
  const element = document.createElement('a');

  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodedText}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
