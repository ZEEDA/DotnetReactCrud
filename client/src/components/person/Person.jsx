import { Pencil, Trash2 } from 'lucide-react'
import usePersonStore from '../../stores/personStore'

function Person({ person }) {
  const onEdit = usePersonStore((state) => state.onEdit)
  const onDelete = usePersonStore((state) => state.onDelete)

  return (
    <li className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <span className="font-medium text-gray-800">
        {person.firstName} {person.lastName}
      </span>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onEdit(person)}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-700"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(person)}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm bg-red-50 text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </li>
  )
}

export default Person
