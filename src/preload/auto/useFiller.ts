import { UseFiller } from './types'

export const useFiller: UseFiller = async (getData) => {
  const fields = await getData()
  console.log(fields)
}
