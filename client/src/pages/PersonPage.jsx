import { useEffect } from "react";
import { toast } from "sonner";
import ErrorBoundary from "../components/ErrorBoundary";
import PersonForm from "../components/person/PersonForm";
import PersonList from "../components/person/PersonList";
import getErrorMessage from "../services/getErrorMessage";
import personService from "../services/personService";
import usePersonStore from "../stores/personStore";

// Runs a request behind a loading toast that turns into success or error.
// Resolves to true on success so callers can react (e.g. reset the form).
async function withToast(request, { loading, success, error }) {
  const id = toast.loading(loading);
  try {
    await request();
    toast.success(success, { id });
    return true;
  } catch (err) {
    toast.error(error, { id, description: getErrorMessage(err) });
    return false;
  }
}

// Having an id means the form was loaded with an existing person
async function handleSubmit(formValues) {
  const store = usePersonStore.getState();
  const name = `${formValues.firstName} ${formValues.lastName}`;
  const isUpdate = Boolean(formValues.id);

  const ok = await withToast(
    () =>
      isUpdate
        ? personService.update(formValues.id, formValues)
        : personService.create(formValues),
    {
      loading: isUpdate ? `Updating ${name}…` : `Adding ${name}…`,
      success: isUpdate ? `${name} updated` : `${name} added`,
      error: isUpdate ? `Could not update ${name}` : `Could not add ${name}`,
    }
  );
  if (!ok) return false;

  if (isUpdate) store.clearSelectedPerson();
  await store.loadPeople();
  return true;
}

// Load the person into the form for editing
function handleEdit(person) {
  usePersonStore.getState().setSelectedPerson(person);
}

async function handleDelete(person) {
  const confirmed = window.confirm(
    `Are you sure you want to delete ${person.firstName} ${person.lastName}?`
  );
  if (!confirmed) return;

  const store = usePersonStore.getState();
  const name = `${person.firstName} ${person.lastName}`;
  const ok = await withToast(() => personService.remove(person.id), {
    loading: `Deleting ${name}…`,
    success: `${name} deleted`,
    error: `Could not delete ${name}`,
  });
  if (!ok) return;

  // Don't leave a deleted person loaded in the form
  if (store.selectedPerson?.id === person.id) store.clearSelectedPerson();
  await store.loadPeople();
}

// Share the handlers with Person through the store. Registered once when the
// module loads, so no effect or re-render is involved.
usePersonStore.getState().setHandlers({
  onSubmit: handleSubmit,
  onEdit: handleEdit,
  onDelete: handleDelete,
});

function PersonPage() {
  const selectedPerson = usePersonStore((state) => state.selectedPerson);
  const peopleData = usePersonStore((state) => state.people);

  // Load people from the API on mount
  useEffect(() => {
    usePersonStore.getState().loadPeople();
  }, []);

  return (
    <>
      <ErrorBoundary>
        <p>Person Management</p>
        <div className="py-4">
          {/* key remounts the form so it reloads when switching between people */}
          <PersonForm
            key={selectedPerson?.id ?? "new"}
            person={selectedPerson}
          />
        </div>
      </ErrorBoundary>
      <ErrorBoundary>
        <div className="py-4 flex justify-center">
          {peopleData && peopleData.length > 0 ? (
            <PersonList people={peopleData} className="w-full" />
          ) : (
            <div
              role="alert"
              className="liquid-glass rounded-xl border border-amber-200/60 bg-amber-50/30 px-4 py-3 text-amber-900 shadow-sm text-center"
            >
              <p className="font-medium">No persons available.</p>
              <p className="mt-1 text-sm text-amber-800/90">
                Add your first person using the form above.
              </p>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </>
  );
}

export default PersonPage;
