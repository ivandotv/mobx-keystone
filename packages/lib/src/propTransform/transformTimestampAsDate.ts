import { MaybeOptionalModelProp, OnlyPrimitives, OptionalModelProp, prop } from "../model/prop"
import { AnyType, TypeToData } from "../typeChecking/schemas"
import { tProp } from "../typeChecking/tProp"
import { DateBackedByProp } from "./DateBackedByProp"
import { propTransform, transformedProp } from "./propTransform"

/**
 * @deprecated Consider using `prop_dateTimestamp` or `tProp_dateTimestamp` instead.
 *
 * Decorator property transform for number timestamps to Date objects and vice-versa.
 */
export const timestampAsDate = propTransform<number | null | undefined, Date | null | undefined>({
  propToData(prop, setProp) {
    if (typeof prop !== "number") {
      return prop
    }
    if (setProp) {
      return new DateBackedByProp(prop, date => {
        setProp(date.getTime())
      })
    } else {
      return new Date(prop)
    }
  },
  dataToProp(date) {
    return date instanceof Date ? date.getTime() : date
  },
})

/**
 * Transforms dates into timestamps.
 */
export type TransformDateToTimestamp<T> = (T extends Date ? number : never) | Exclude<T, Date>

/**
 * Transforms timestamps into dates.
 */
export type TransformTimestampToDate<T> = (T extends number ? Date : never) | Exclude<T, number>

export function prop_dateTimestamp<TValue>(): MaybeOptionalModelProp<
  TransformDateToTimestamp<TValue>,
  TValue
>

export function prop_dateTimestamp<TValue>(
  defaultFn: () => TValue
): OptionalModelProp<TransformDateToTimestamp<TValue>, TValue>

export function prop_dateTimestamp<TValue>(
  defaultValue: OnlyPrimitives<TValue>
): OptionalModelProp<TransformDateToTimestamp<TValue>, TValue>

export function prop_dateTimestamp(def?: any) {
  return transformedProp(prop(def), timestampAsDate, true)
}

export function tProp_dateTimestamp<TType extends AnyType>(
  type: TType
): MaybeOptionalModelProp<TypeToData<TType>, TransformTimestampToDate<TypeToData<TType>>>

export function tProp_dateTimestamp<TType extends AnyType>(
  type: TType,
  defaultFn: () => TransformTimestampToDate<TypeToData<TType>>
): OptionalModelProp<TypeToData<TType>, TransformTimestampToDate<TypeToData<TType>>>

export function tProp_dateTimestamp<TType extends AnyType>(
  type: TType,
  defaultValue: OnlyPrimitives<TransformTimestampToDate<TypeToData<TType>>>
): OptionalModelProp<TypeToData<TType>, TransformTimestampToDate<TypeToData<TType>>>

export function tProp_dateTimestamp(typeOrDefaultValue: any, def?: any) {
  return transformedProp(tProp(typeOrDefaultValue, def), timestampAsDate, true)
}
