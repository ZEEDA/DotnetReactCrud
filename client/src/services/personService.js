import api from './api'

// Wraps the PeopleController endpoints (/api/people); each call returns the response data
const personService = {
  getAll: () => api.get('/people').then((res) => res.data),
  getById: (id) => api.get(`/people/${id}`).then((res) => res.data),
  create: (person) => api.post('/people', person).then((res) => res.data),
  update: (id, person) =>
    api.put(`/people/${id}`, person).then((res) => res.data),
  remove: (id) => api.delete(`/people/${id}`).then((res) => res.data),
}

export default personService
