import axiosClient from './axiosClient'

const boardApi = {
  fetchBoardDetails: async (id) => {
    const response = await axiosClient.get(`/v1/boards/${id}`)
    console.log(response)
    return response
  }
}

export default boardApi