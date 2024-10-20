const mapper = {
  MONGODB_URI: '$MONGODB_URI',
  MONGO_DB: '$MONGO_DB',
  JWT_SECRET: '$JWT_SECRET',
}

// for all mapper.keys, if the value starts with $, replace it with process.env.[the key]

for (const key in mapper) {
  const _key: keyof typeof mapper = key as any
  if (mapper[_key].startsWith('$')) {
    mapper[_key] = process.env[mapper[_key].substring(1)] as string
  }
}

export const env = mapper
