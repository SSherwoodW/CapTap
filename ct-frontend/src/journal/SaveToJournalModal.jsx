import { useState } from 'react';
import { Dialog } from '@headlessui/react';

function SaveToJournalModal({ onSave, onDescriptionChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');

  const handleClose = () => {
        setIsOpen(false);
  };

  const handleSave = () => {
    onSave(description);
    setDescription('');
    handleClose();
  };
    
const handleChange = (event) => {
    const value = event.target.value;
    setDescription(value);
    onDescriptionChange(value);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Save To Journal</button>
      <Dialog open={isOpen} onClose={handleClose}>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Save to Journal</h2>
          <textarea
            value={description}
            onChange={handleChange}
            placeholder="Enter description..."
            className="w-full h-32 border rounded p-2 mb-4"
          />
          <div className="flex justify-end">
            <button onClick={handleClose} className="mr-4">Cancel</button>
            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default SaveToJournalModal;