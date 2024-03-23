import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SaveToJournalModal from './SaveToJournalModal';

describe('SaveToJournalModal', () => {
    it('opens and closes the modal', () => {
        const onSave = vi.fn();
        const onDescriptionChange = vi.fn();

        render(<SaveToJournalModal onSave={onSave} onDescriptionChange={onDescriptionChange} />);

        expect(screen.queryByText('Save to Journal')).not.toBeInTheDocument();

        const createButton = screen.getByText('Create Journal Entry');
        act(() => {
            createButton.click();
        });     

        expect(screen.getByText('Save to Journal')).toBeInTheDocument();

        const cancelButton = screen.getByText('Cancel');
        act(() => {
            cancelButton.click();
        });  

        expect(screen.queryByText('Save to Journal')).not.toBeInTheDocument();
    });

    it('calls onSave with the correct argument when save button is clicked', () => {
        const onSave = vi.fn();
        const onDescriptionChange = vi.fn();

        render(<SaveToJournalModal onSave={onSave} onDescriptionChange={onDescriptionChange} />);

        const createButton = screen.getByText('Create Journal Entry');
        act(() => {
            createButton.click();
        }); 

        // Type a description into the textarea
        fireEvent.change(screen.getByPlaceholderText('Enter description...'), {
        target: { value: 'Test Description' }
        });

        // Click the save button
        const saveButton = screen.getByText('Save');
        act(() => {
            saveButton.click();
        }); 

        expect(onSave).toHaveBeenCalledWith('Test Description');
    });

    it('calls onDescriptionChange with the correct argument when description input changes', () => {
        const onSave = vi.fn();
        const onDescriptionChange = vi.fn();

        render(<SaveToJournalModal onSave={onSave} onDescriptionChange={onDescriptionChange} />);

        const createButton = screen.getByText('Create Journal Entry');
        act(() => {
            createButton.click();
        }); 

        fireEvent.change(screen.getByPlaceholderText('Enter description...'), {
        target: { value: 'Test Description' }
        });

        expect(onDescriptionChange).toHaveBeenCalledWith('Test Description');
    });
});
