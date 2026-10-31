import Person from './Person'

function PersonList({ people, className }) {
  if (people.length === 0) {
    return <p className="text-gray-500">No people found.</p>
  }

  return (
    <ul className={`flex flex-col gap-2 ${className}`}>
      {people.map((person) => (
        <Person key={person.id} person={person} />
      ))}
    </ul>
  )
}

export default PersonList
