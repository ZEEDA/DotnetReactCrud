import { create } from 'zustand'
import { toast } from 'sonner'
import personService from '../services/personService'
import getErrorMessage from '../services/getErrorMessage'

// Holds the person action handlers so Person can use them without prop drilling.
// PersonPage registers the real handlers via setHandlers.
// selectedPerson is the person being edited (null when adding a new one).
const usePersonStore = create((set) => ({
  onSubmit: async () => false,
  onEdit: () => {},
  onDelete: () => {},
  setHandlers: ({ onSubmit, onEdit, onDelete }) =>
    set({ onSubmit, onEdit, onDelete }),
  selectedPerson: null,
  setSelectedPerson: (person) => set({ selectedPerson: person }),
  clearSelectedPerson: () => set({ selectedPerson: null }),
  // People loaded from the API; call loadPeople after any change to refresh
  people: [],
  loadPeople: () =>
    personService
      .getAll()
      .then((people) => set({ people }))
      .catch((error) =>
        toast.error('Could not load people', {
          description: getErrorMessage(error),
        })
      ),
}))

export default usePersonStore
