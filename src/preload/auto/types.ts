export type AllowField = string | RegExp

export type ExcludedField = AllowField

export type UseCollectorOption = {
  allowFields?: AllowField[]
  excludedFields?: ExcludedField[]
}

export type UseCollector = (
  option: UseCollectorOption,
  callback: (e: SubmitEvent, payload: Record<string, string>) => void
) => void
