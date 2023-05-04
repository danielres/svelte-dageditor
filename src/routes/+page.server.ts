import { redirect } from '@sveltejs/kit'

const MOVED_TEMPORARILY = 302

export const load = async () => {
  throw redirect(MOVED_TEMPORARILY, '/v2')
}
