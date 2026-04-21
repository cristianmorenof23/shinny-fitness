function collectMessages(error: unknown, messages: string[]) {
  if (!error) {
    return
  }

  if (typeof error === 'string') {
    messages.push(error)
    return
  }

  if (error instanceof Error) {
    messages.push(error.message)
    const maybeCause = (error as Error & { cause?: unknown }).cause
    if (maybeCause) {
      collectMessages(maybeCause, messages)
    }
    return
  }

  if (typeof error === 'object') {
    const record = error as Record<string, unknown>

    if (typeof record.message === 'string') {
      messages.push(record.message)
    }

    if (typeof record.originalMessage === 'string') {
      messages.push(record.originalMessage)
    }

    if (typeof record.cause === 'string') {
      messages.push(record.cause)
    } else if (record.cause) {
      collectMessages(record.cause, messages)
    }
  }
}

function getErrorText(error: unknown) {
  const messages: string[] = []
  collectMessages(error, messages)
  return messages.join(' ').toLowerCase()
}

export function isDatabaseCapacityError(error: unknown) {
  const text = getErrorText(error)

  return (
    text.includes('pool timeout') ||
    text.includes('failed to retrieve a connection from pool') ||
    text.includes('max_connections_per_hour') ||
    text.includes('exceeded the') ||
    text.includes('resource (current value') ||
    text.includes('sqlstate: 42000') ||
    text.includes('no: 1226')
  )
}

export function isDatabaseSchemaError(error: unknown) {
  const text = getErrorText(error)

  return (
    text.includes('unknown column') ||
    text.includes('doesn\'t exist') ||
    text.includes('table') && text.includes('doesn\'t exist') ||
    text.includes('invalid invocation')
  )
}

export function getDatabaseCapacityMessage(action: string) {
  return `No pudimos conectar con la base de datos para ${action}. El hosting alcanzo el limite de conexiones de MySQL o esta saturado. Espera unos minutos y vuelve a intentar.`
}

export function getDatabaseSchemaMessage(action: string) {
  return `No pudimos conectar con la base de datos para ${action}. Parece que hay cambios pendientes en Prisma/MySQL. Revisa las migraciones y vuelve a intentar.`
}
