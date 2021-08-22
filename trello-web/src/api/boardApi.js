import axiosClient from './axiosClient'

const boardApi = {
  fetchBoardDetails: async (id) => {
    const response = await axiosClient.get(`/v1/boards/${id}`)
    return response
  },
  updateBoard: async (id, data) => {
    const response = await axiosClient.put(`/v1/boards/${id}`, data)
    return response
  }
}

export default boardApi