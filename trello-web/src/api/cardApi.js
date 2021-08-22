import axiosClient from './axiosClient'

const columnApi = {
  createNewCard: async (data) => {
    const response = await axiosClient.post('/v1/cards/', data)
    return response
  },
  updatedCard: async (id, data) => {
    const response = await axiosClient.put(`/v1/cards/${id}`, data)
    return response
  }
}

export default columnApi