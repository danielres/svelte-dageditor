import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

const MOVED_TEMPORARILY = 302

export const load = (async () => {
  throw redirect(MOVED_TEMPORARILY, '/v2')
}) satisfies PageServerLoad
