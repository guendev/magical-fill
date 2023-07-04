export type AllowField = string | RegExp

export type ExcludedField = AllowField

export type FieldData = Record<string, string>

export type UseCollectorOption = {
  allowFields?: AllowField[]
  excludedFields?: ExcludedField[]
}

export type UseCollector = (
  option: UseCollectorOption,
  callback: (e: SubmitEvent, payload: FieldData) => void
) => void

export type UseFiller = (getPayload: () => FieldData[] | Promise<FieldData[]>) => void

export type UseFormInteraction = (callback: (form: HTMLFormElement) => void, attr: string) => void
