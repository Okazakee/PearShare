const FilePicker = ({ selectedFile, setSelectedFile }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="file-picker">
      <input
        className="input-text"
        type="text"
        value={selectedFile ? selectedFile.name : ''}
        onClick={handleClick}
        readOnly
        placeholder="Click to select a file"
      />
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};