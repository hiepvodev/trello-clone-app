import axiosClient from './axiosClient'

const columnApi = {
  createNewColumn: async (data) => {
    const response = await axiosClient.post('/v1/columns/', data)
    return response
  },
  updateColumn: async (id, data) => {
    const response = await axiosClient.put(`/v1/columns/${id}`, data)
    return response
  }
}

export default columnApi