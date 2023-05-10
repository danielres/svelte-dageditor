import type { PageServerLoad } from './$types'
const nodes = [
  { name: '<root>', id: '<root>' },
  { id: 'ecce860d-b766-4421-9e7e-c7f1908805cc', name: 'software engineering' },
  { id: 'a94894d0-e8a5-4c2d-901f-0c28c4334305', name: 'web dev' },
  { id: 'afc92c27-6681-4c03-875d-ee79bd8ac1fe', name: 'frontend' },
  { id: '167825aa-2d66-4900-890f-1c62246fc2a7', name: 'backend' },
  { id: '9c53dd7f-ec67-433d-b938-9f618456872d', name: 'full-stack' },
  { id: 'c4ec3583-c1cb-4650-99ee-0c062e973626', name: 'sveltekit' },
  { id: '3f42a48b-cc60-4436-b7cb-4f320479f050', name: 'new tech' },
]

const relations = [
  {
    id: '61fb9c77-8e05-4c3a-ada2-88e27b485f19',
    parentId: '<root>',
    childId: 'ecce860d-b766-4421-9e7e-c7f1908805cc',
  },
  {
    id: '2b24f3f7-02a6-4cd1-9f68-07cc5cd453d6',
    parentId: 'ecce860d-b766-4421-9e7e-c7f1908805cc',
    childId: 'a94894d0-e8a5-4c2d-901f-0c28c4334305',
  },
  {
    id: '4d542128-28f6-44c1-b6ed-41e42e68d82a',
    parentId: '9c53dd7f-ec67-433d-b938-9f618456872d',
    childId: 'afc92c27-6681-4c03-875d-ee79bd8ac1fe',
  },
  {
    id: '16242495-7293-4f75-8ae3-de37e229a545',
    parentId: '9c53dd7f-ec67-433d-b938-9f618456872d',
    childId: '167825aa-2d66-4900-890f-1c62246fc2a7',
  },
  {
    id: '0b2c77b9-8eed-42ab-bde2-fc8fe5109cac',
    parentId: 'a94894d0-e8a5-4c2d-901f-0c28c4334305',
    childId: '9c53dd7f-ec67-433d-b938-9f618456872d',
  },
  {
    id: '14e9ed13-2c86-45df-a1bb-dd60262069db',
    parentId: '9c53dd7f-ec67-433d-b938-9f618456872d',
    childId: 'c4ec3583-c1cb-4650-99ee-0c062e973626',
  },
  {
    id: '0fd5d561-8ae8-403f-a8a9-19a70d834001',
    parentId: 'ecce860d-b766-4421-9e7e-c7f1908805cc',
    childId: '3f42a48b-cc60-4436-b7cb-4f320479f050',
  },
]
export const load = (async () => {
  return { nodes, relations }
}) satisfies PageServerLoad
